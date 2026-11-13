'use client';

import { Children, type ReactNode,useState } from 'react';

export default function MarkdownPagination({
   children
}: Readonly<{
   children?: ReactNode;
}>) {
   const pages = Children.toArray(children);
   const [currentPage, setCurrentPage] = useState(0);

   if (!pages.length) return null;

   const isFirstPage = currentPage === 0;
   const isLastPage = currentPage === pages.length - 1;

   return (
      <div>
         <div>{pages[currentPage]}</div>

         <div className="flex items-center justify-between mt-8 mb-8">
            <button
               onClick={() => setCurrentPage((page) => page - 1)}
               disabled={isFirstPage}
               className="px-4 py-2 border rounded disabled:opacity-40 disabled:cursor-not-allowed "
            >
               Back
            </button>

            <span className="text-sm text-neutral-500">
               Page {currentPage + 1} of {pages.length}
            </span>

            <button
               onClick={() => setCurrentPage((page) => page + 1)}
               disabled={isLastPage}
               className="px-4 py-2 border rounded disabled:opacity-40 disabled:cursor-not-allowed"
            >
               Next
            </button>
         </div>
      </div>
   );
}