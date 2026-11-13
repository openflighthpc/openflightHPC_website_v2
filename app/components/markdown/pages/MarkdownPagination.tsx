'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Children, type ReactNode, useEffect, useRef, useState } from 'react';

export default function MarkdownPagination({
   children
}: Readonly<{
   children?: ReactNode;
}>) {
   const pages = Children.toArray(children);
   const [currentPage, setCurrentPage] = useState(0);
   const scrolling = useRef(false);

   useEffect(() => {
      if (!scrolling.current) return;

      document.getElementById('page-start')?.scrollIntoView({
         behavior: 'smooth',
         block: 'start'
      });
      scrolling.current = false;
   }, [currentPage]);

   if (!pages.length) return null;

   const isFirstPage = currentPage === 0;
   const isLastPage = currentPage === pages.length - 1;

   return (
      <div id="page-start" className="scroll-mt-24">
         <div>{pages[currentPage]}</div>

         <div className="flex items-center justify-between mt-8 mb-8">
            <button
               onClick={() => {
                  scrolling.current = true;

                  setCurrentPage((page) => page - 1);
               }}
               disabled={isFirstPage}
               className={`flex items-center px-4 py-2 cursor-pointer border ${isFirstPage ? 'opacity-0' : ''} rounded-full transition font-bold hover:bg-white/10 duration-200 disabled:cursor-not-allowed`}
            >
               <ChevronLeft className="text-white/70" />
               Back
            </button>

            <span className="text-sm text-neutral-500">
               Page {currentPage + 1} of {pages.length}
            </span>

            <button
               onClick={() => {
                  scrolling.current = true;
                  setCurrentPage((page) => page + 1);
               }}
               disabled={isLastPage}
               className={`flex items-center px-4 py-2 border cursor-pointer ${isLastPage ? 'opacity-0' : ''} rounded-full font-bold transition hover:bg-white/10 duration-200 disabled:cursor-not-allowed`}
            >
               Next
               <ChevronRight className="text-white/70" />
            </button>
         </div>
      </div>
   );
}
