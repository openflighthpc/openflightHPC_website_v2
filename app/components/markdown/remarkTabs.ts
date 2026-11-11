type MdastNode = {
   type: string;
   value?: string;
   labels?: string[];
   label?: string;
   data?: {
      hName?: string;
      hProperties?: Record<string, unknown>;
   };
   children?: MdastNode[];
};

/**
 * `:::tabs A | B | C` opens a tabset. Each panel inside is bounded by a
 * `:::Label` line and a bare `:::` line; a bare `:::` closes whichever
 * container is innermost — the open panel, else the tabset itself.
 */
const TABS_MARKER = /^:::tabs\s+(.+)$/;

/** `:::Label` — anything after `:::` that is not `tabs` or empty. */
const PANEL_MARKER = /^:::(.+)$/;

/** A line holding only `:::` closes the innermost container. */
const CLOSE_MARKER = /^:::\s*$/;

/** Internal marker node types, consumed before anything reaches hast. */
const OPEN_MARKER_TYPE = 'tabsOpen';
const PANEL_MARKER_TYPE = 'tabsPanel';
const PANEL_CLOSE_MARKER_TYPE = 'tabsPanelClose';
const CLOSE_MARKER_TYPE = 'tabsClose';

function textOf(node: { children?: MdastNode[] }): string {
   return (node.children ?? []).map((child) => child.value ?? '').join('');
}

/** One visual line's worth of a paragraph's children. */
type Piece = {
   children: MdastNode[];
   /** Separator that ended this line: soft `\n`, hard break, or none. */
   separator: 'soft' | 'hard' | null;
};

/**
 * Splits a paragraph into per-line pieces. remark folds soft-wrapped
 * lines into single text values, so terminators like `:::` can be
 * buried mid-paragraph and invisible to block-level scanning.
 */
function explodeParagraph(node: MdastNode): Piece[] {
   const pieces: Piece[] = [];
   let current: MdastNode[] = [];

   const close = (separator: Piece['separator']) => {
      pieces.push({ children: current, separator });
      current = [];
   };

   for (const child of node.children ?? []) {
      if (child.type === 'text' && child.value?.includes('\n')) {
         const parts = child.value.split('\n');
         for (let index = 0; index < parts.length; index += 1) {
            if (parts[index]) current.push({ type: 'text', value: parts[index] });
            if (index < parts.length - 1) close('soft');
         }
      } else if (child.type === 'break') {
         close('hard');
      } else {
         current.push(child);
      }
   }

   close(null);
   return pieces;
}

/**
 * Rebuilds exploded pieces back into paragraph children, re-adding the
 * text/break separators that were consumed while splitting.
 */
function rejoin(pieces: Piece[]): MdastNode[] {
   const children: MdastNode[] = [];

   for (const piece of pieces) {
      children.push(...piece.children);
      if (piece.separator && children.length) {
         children.push(
            piece.separator === 'hard' ? { type: 'break' } : { type: 'text', value: '\n' }
         );
      }
   }

   return children;
}

/** Classifies one line-piece: tabset open, panel open, closer, or plain. */
function classifyPiece(piece: Piece): {
   kind: 'tabs' | 'panel' | 'close' | 'plain';
   labels?: string[];
   label?: string;
} {
   const line = textOf(piece).trim();

   const tabsMatch = line.match(TABS_MARKER);
   if (tabsMatch) {
      return { kind: 'tabs', labels: tabsMatch[1].split('|').map((label) => label.trim()) };
   }

   const panelMatch = line.match(PANEL_MARKER);
   if (panelMatch) {
      return { kind: 'panel', label: panelMatch[1].trim() };
   }

   return CLOSE_MARKER.test(line) ? { kind: 'close' } : { kind: 'plain' };
}

/**
 * Turns paragraphs holding marker lines into internal marker nodes plus
 * rebuilt paragraphs, so tabs written without blank lines still find
 * their terminators.
 *
 * Depth tracks nesting, since a bare `:::` is ambiguous: 0 = outside any
 * tabset, 1 = inside a tabset but not a panel, 2+ = inside a panel. The
 * line closes the innermost container — a panel at depth 2+, the tabset
 * at depth 1. Bare `:::` lines seen at depth 0 pass through untouched so
 * remarkCollapse (running later) keeps claiming its own closers.
 */
function splitMarkerParagraphs(nodes: MdastNode[]): MdastNode[] {
   const out: MdastNode[] = [];
   // 0 outside, 1 inside a tabset without a panel, 2+ inside a panel.
   let depth = 0;

   for (const node of nodes) {
      // Non-paragraph blocks can never be markers; pass them through
      // unexamined.
      if (node.type !== 'paragraph') {
         out.push(node);
         continue;
      }

      const pieces = explodeParagraph(node);
      const lineKinds = pieces.map((piece) => classifyPiece(piece));

      if (lineKinds.every((line) => line.kind === 'plain')) {
         out.push(node);
         continue;
      }

      // A paragraph holding only bare `:::` lines while no tabset is open
      // belongs to remarkCollapse.
      if (depth === 0 && lineKinds.every((line) => line.kind === 'close')) {
         out.push(node);
         continue;
      }

      let pending: Piece[] = [];
      const flush = () => {
         if (!pending.length) return;
         const children = rejoin(pending);
         if (children.length) out.push({ children, type: 'paragraph' });
         pending = [];
      };

      for (let index = 0; index < pieces.length; index += 1) {
         const classified = lineKinds[index];

         if (classified.kind === 'tabs' && depth <= 1) {
            flush();
            depth = 1;
            out.push({ labels: classified.labels, type: OPEN_MARKER_TYPE });
         } else if (classified.kind === 'panel' && depth === 1) {
            flush();
            depth = 2;
            out.push({ label: classified.label, type: PANEL_MARKER_TYPE });
         } else if (classified.kind === 'close') {
            // Bare `:::` closes the innermost open container.
            if (depth >= 2) {
               flush();
               depth = 1;
               out.push({ type: PANEL_CLOSE_MARKER_TYPE });
            } else if (depth === 1) {
               flush();
               depth = 0;
               out.push({ type: CLOSE_MARKER_TYPE });
            } else {
               pending.push(pieces[index]);
            }
         } else {
            pending.push(pieces[index]);
         }
      }

      flush();
   }

   return out;
}

/**
 * Walks the split block list, replacing marker regions with a custom
 * `tabset` node whose children are one `tabpanel` node per panel,
 * carrying its label in `data.hProperties`. Panel content keeps its
 * original node types — code fences are never re-wrapped in a paragraph,
 * which is what kept CodeBlock's `<div>` from landing inside a `<p>` and
 * breaking hydration. An unclosed tabset swallows to the end of the
 * document, mirroring remarkCollapse's behaviour for its own containers.
 */
function spliceTabsets(nodes: MdastNode[]): MdastNode[] {
   const out: MdastNode[] = [];
   let index = 0;

   while (index < nodes.length) {
      const node = nodes[index];

      if (node.type !== OPEN_MARKER_TYPE) {
         // A stray closer with no matching open is dropped.
         if (node.type !== CLOSE_MARKER_TYPE && node.type !== PANEL_CLOSE_MARKER_TYPE) {
            out.push(node);
         }
         index += 1;
         continue;
      }

      const panels: { label: string; children: MdastNode[] }[] = [];
      let current: { label: string; children: MdastNode[] } | undefined;
      let cursor = index + 1;

      while (cursor < nodes.length) {
         const candidate = nodes[cursor];

         if (candidate.type === PANEL_MARKER_TYPE) {
            current = { children: [], label: candidate.label ?? '' };
            panels.push(current);
         } else if (candidate.type === PANEL_CLOSE_MARKER_TYPE) {
            current = undefined;
         } else if (candidate.type === CLOSE_MARKER_TYPE) {
            cursor += 1;
            break;
         } else {
            // Content before the first `:::Label` lands in an unlabelled
            // implicit first panel.
            if (!current) {
               current = { children: [], label: '' };
               panels.push(current);
            }
            current.children.push(candidate);
         }

         cursor += 1;
      }

      const labels = node.labels ?? [];

      out.push({
         children: panels.map((panel, panelIndex) => ({
            children: panel.children,
            data: {
               hName: 'tabpanel',
               hProperties: {
                  'data-index': String(panelIndex),
                  'data-label': panel.label
               }
            },
            type: 'tabpanel'
         })),
         data: {
            hName: 'tabset',
            hProperties: { 'data-labels': labels.join(' | ') }
         },
         type: 'tabset'
      });

      index = cursor;
   }

   return out;
}

/**
 * Remark plugin for tabbed sections written as fenced containers in the
 * markdown source:
 *
 * :::tabs Setup | Run | Results
 * :::Setup
 * any markdown, any number of blocks
 *
 * including code fences
 * :::
 *
 * :::Run
 * the next panel
 * :::
 * :::
 *
 * The opener's pipe-separated labels name the tabs in panel order; each
 * panel is bounded by a `:::Label` line and a closing `:::` line and can
 * hold any number of blocks. Blank lines around the markers are optional.
 * Panels cannot be nested, and neither can tabsets. A `:::` line inside
 * a panel always closes the panel, so collapse containers belong outside
 * tabsets.
 */
export default function remarkTabs() {
   return (tree: unknown) => {
      const root = tree as MdastNode;
      root.children = spliceTabsets(splitMarkerParagraphs(root.children ?? []));
   };
}
