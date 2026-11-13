type MdastNode = {
   type: string;
   value?: string;
   data?: {
      hName?: string;
      hProperties?: Record<string, unknown>;
   };
   children?: MdastNode[];
};

const PAGE_BREAK_MARKER = /^\s*:::page-break\s*$/;

export default function remarkPages() {
   return (tree: unknown) => {
      const root = tree as MdastNode;
      const pages: MdastNode[][] = [[]];
      let hasPageBreak = false;

      for (const node of root.children ?? []) {
         if (
            node.type === 'paragraph' &&
            node.children?.some(
               (child) => child.type === 'text' && PAGE_BREAK_MARKER.test(child.value ?? '')
            )
         ) {
            hasPageBreak = true;

            if (pages[pages.length - 1].length > 0) {
               pages.push([]);
            }

            continue;
         }

         pages[pages.length - 1].push(node);
      }

      if (!hasPageBreak) return;

      while (pages.length > 1 && pages[pages.length - 1].length === 0) {
         pages.pop();
      }

      root.children = [
         {
            children: pages.map((children) => ({
               children,
               data: {
                  hName: 'page'
               },
               type: 'page'
            })),
            data: {
               hName: 'pagination'
            },
            type: 'pagination'
         }
      ];
   };
}
