import { MdastNode } from '../assets/types';

/**
 * Breaks the code into nodes for the syntax tree
 * @param tree The tree to handle
 */
export default function remarkCodeMeta(tree: unknown) {
   const visitNode = (node: MdastNode) => {
      if (node.type === 'code' && node.meta) {
         node.data = { ...node.data, hProperties: { meta: node.meta } };
      }
      node.children?.forEach(visitNode);
   };
   visitNode(tree as MdastNode);
}
