type MdastNode = {
   type: string;
   // Only on text nodes.
   value?: string;
   data?: {
      hName?: string;
      hProperties?: Record<string, unknown>;
   };
   children?: MdastNode[];
   // Only on internal marker nodes created while splitting paragraphs.
   open?: boolean;
   titleChildren?: MdastNode[];
};

/**
 * `:::collapse open|closed Title` — the state keyword is optional and
 * defaults to closed; everything after it on the line is the title.
 */
const COLLAPSE_MARKER = /^:::collapse(?:\s+(open|closed))?(?:\s+(.+))?$/;

/** A line holding only `:::` closes the innermost container. */
const CLOSE_MARKER = /^:::\s*$/;

/** Internal marker node types, consumed before anything reaches hast. */
const OPEN_MARKER_TYPE = 'collapseOpen';
const CLOSE_MARKER_TYPE = 'collapseClose';

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

/** Classifies one line-piece as an open marker, closer, or plain text. */
function classifyPiece(piece: Piece): {
   kind: 'open' | 'close' | 'plain';
   open?: boolean;
   title?: string;
} {
   const line = textOf(piece).trim();
   const openMatch = line.match(COLLAPSE_MARKER);

   if (openMatch) {
      return {
         kind: 'open',
         open: openMatch[1] === 'open',
         title: openMatch[2]?.trim() || 'Details'
      };
   }

   return CLOSE_MARKER.test(line) ? { kind: 'close' } : { kind: 'plain' };
}

/**
 * Turns paragraphs holding marker lines into internal marker nodes plus
 * rebuilt paragraphs, so containers written without blank lines still
 * find their terminators. Paragraphs without markers pass through
 * completely untouched.
 */
function splitMarkerParagraphs(nodes: MdastNode[]): MdastNode[] {
   const out: MdastNode[] = [];

   for (const node of nodes) {
      if (node.type !== 'paragraph') {
         out.push(node);
         continue;
      }

      const pieces = explodeParagraph(node);
      if (!pieces.some((piece) => classifyPiece(piece).kind !== 'plain')) {
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

      for (const piece of pieces) {
         const classified = classifyPiece(piece);

         if (classified.kind === 'open') {
            flush();
            out.push({
               open: classified.open,
               titleChildren: [{ type: 'text', value: classified.title ?? 'Details' }],
               type: OPEN_MARKER_TYPE
            });
         } else if (classified.kind === 'close') {
            flush();
            out.push({ type: CLOSE_MARKER_TYPE });
         } else {
            pending.push(piece);
         }
      }

      flush();
   }

   return out;
}

/**
 * Walks the split block list, replacing `collapseOpen … collapseClose`
 * regions with custom nodes that mdast-util-to-hast renders as native
 * `<details open?>` via the `hName` / `hProperties` data fields. Depth
 * tracking plus recursion over the gathered content supports nesting.
 * A stray `:::` with no open container is dropped as plain text.
 */
function spliceContainers(nodes: MdastNode[]): MdastNode[] {
   const out: MdastNode[] = [];
   let index = 0;

   while (index < nodes.length) {
      const node = nodes[index];

      if (node.type !== OPEN_MARKER_TYPE) {
         if (node.type !== CLOSE_MARKER_TYPE) out.push(node);
         index += 1;
         continue;
      }

      const summaryNode: MdastNode = {
         children: node.titleChildren ?? [{ type: 'text', value: 'Details' }],
         data: { hName: 'summary', hProperties: {} },
         type: 'paragraph'
      };

      const content: MdastNode[] = [];
      let depth = 1;
      let cursor = index + 1;

      while (cursor < nodes.length && depth > 0) {
         const candidate = nodes[cursor];

         if (candidate.type === OPEN_MARKER_TYPE) {
            depth += 1;
         } else if (candidate.type === CLOSE_MARKER_TYPE) {
            depth -= 1;
            if (depth === 0) {
               cursor += 1;
               break;
            }
         }

         content.push(candidate);
         cursor += 1;
      }

      out.push({
         children: [summaryNode, ...spliceContainers(content)],
         data: {
            hName: 'details',
            ...(node.open ? { hProperties: { open: true } } : {})
         },
         type: 'collapse'
      });

      index = cursor;
   }

   return out;
}

/**
 * Remark plugin for collapsible sections written as fenced containers in
 * the markdown source:
 *
 * :::collapse open An open section by default
 * any markdown
 * :::
 *
 * :::collapse closed A closed section by default
 * any markdown
 * :::
 *
 * The state keyword is optional and defaults to closed. Containers can
 * be nested, and may be written without blank lines: the closing `:::`
 * only needs to be on its own line, even when remark soft-wrapped that
 * line into the same paragraph as the content above it.
 */
export default function remarkCollapse() {
   return (tree: unknown) => {
      const root = tree as MdastNode;
      root.children = spliceContainers(splitMarkerParagraphs(root.children ?? []));
   };
}
