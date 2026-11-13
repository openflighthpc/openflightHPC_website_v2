import { MdastNode } from '../assets/types';

/**
 * Breaks the code into nodes for the syntax tree; copies a fence's
 * info-string meta into `data.hProperties` so it survives into the hast
 * `code` element.
 * @returns The transformer to handle the tree with
 */
export default function remarkCodeMeta() {
   return (tree: unknown) => {
      const visitNode = (node: MdastNode) => {
         if (node.type === 'code' && node.meta) {
            node.data = { ...node.data, hProperties: { meta: node.meta } };
         }
         node.children?.forEach(visitNode);
      };
      visitNode(tree as MdastNode);
   };
}
