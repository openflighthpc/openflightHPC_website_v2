import { MdastNode } from '../assets/types';

function hasDelimiter(children: MdastNode[]): boolean {
   return children.some((child) => child.type === 'text' && (child.value ?? '').includes('||'));
}

/**
 * Splits text runs on `||`, toggling between outside and inside a
 * spoiler, and wraps each inside region — text, images, videos, any
 * inline markdown — in a custom node rendered as a blurred span.
 */
function wrapSpoilers(children: MdastNode[]): MdastNode[] {
   const out: MdastNode[] = [];
   let buffer: MdastNode[] = [];
   let inside = false;

   const flush = () => {
      if (buffer.length) {
         out.push({
            children: buffer,
            data: { hName: 'span', hProperties: { className: 'spoiler' } },
            type: 'spoil'
         });
         buffer = [];
      }
   };

   for (const child of children) {
      if (child.type === 'text' && (child.value ?? '').includes('||')) {
         const parts = (child.value ?? '').split('||');

         parts.forEach((part, index) => {
            if (index > 0) {
               if (inside) {
                  flush();
                  inside = false;
               } else {
                  inside = true;
               }
            }

            if (part) {
               if (inside) buffer.push({ type: 'text', value: part });
               else out.push({ type: 'text', value: part });
            }
         });
      } else if (inside) {
         buffer.push(child);
      } else {
         out.push(child);
      }
   }

   // A `||` with no closer leaves its content unspoilered.
   if (inside) out.push(...buffer);

   return out;
}

function walk(node: MdastNode): void {
   const children = node.children;
   if (!children) return;

   if (new Set(['paragraph', 'heading', 'tableCell']).has(node.type)) {
      if (hasDelimiter(children)) node.children = wrapSpoilers(children);
      return;
   }

   children.forEach(walk);
}

/**
 * Remark plugin turning `||…||` spans in markdown into spoilered inline
 * content: blurred until the reader clicks it. Works around words as
 * well as images and videos. Inline code and fences are untouched.
 */
export default function remarkSpoiler() {
   return (tree: unknown) => {
      walk(tree as MdastNode);
   };
}
