'use client';

import { useState } from 'react';

/**
 * An enum for the available sheets
 */
enum SheetEnum {
   summary,
   breakdown
}

/**
 * Combines the breakdown and summary text into tab sections
 * @param breakdownSheet The breakdown text
 * @param summarySheet The summary text
 * @returns The compiled tabs
 */
export default function DossierTabs({
   breakdownSheet,
   summarySheet
}: Readonly<{
   summarySheet: React.ReactNode;
   breakdownSheet: React.ReactNode;
}>) {
   const [active, setActive] = useState<SheetEnum>(SheetEnum.summary);

   return (
      <div className="flex flex-col gap-0">
         <div role="tablist" aria-label="dossier exhibits" className="flex text-md gap-4">
            {[
               { index: '01', key: SheetEnum.summary, label: 'Summary' },
               { index: '02', key: SheetEnum.breakdown, label: 'Breakdown' }
            ].map((tab) => (
               <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={active === tab.key}
                  onClick={() => setActive(tab.key)}
                  className={`cursor-pointer   transition-colors ${
                     active === tab.key
                        ? 'border-neutral-600 font-bold text-neutral-100'
                        : ' bg-transparent text-neutral-500  hover:text-neutral-300'
                  }`}
               >
                  {tab.label}
               </button>
            ))}
         </div>

         <hr className="text-neutral-800"></hr>

         <div className="flex-1">
            {
               {
                  [SheetEnum.breakdown]: breakdownSheet,
                  [SheetEnum.summary]: summarySheet
               }[active]
            }
         </div>
      </div>
   );
}
