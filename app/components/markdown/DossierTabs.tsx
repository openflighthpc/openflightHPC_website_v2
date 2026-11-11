'use client';

import { useState } from 'react';

type SheetKey = 'summary' | 'breakdown';

type DossierTabsProps = {
   summarySheet: React.ReactNode;
   breakdownSheet: React.ReactNode;
};

const TABS: { key: SheetKey; index: string; label: string }[] = [
   { index: '01', key: 'summary', label: 'Summary' },
   { index: '02', key: 'breakdown', label: 'Breakdown' }
];

export default function DossierTabs({ breakdownSheet, summarySheet }: Readonly<DossierTabsProps>) {
   const [active, setActive] = useState<SheetKey>('summary');

   const sheets: Record<SheetKey, React.ReactNode> = {
      breakdown: breakdownSheet,
      summary: summarySheet
   };

   return (
      <div className="flex flex-col gap-0">
         <div role="tablist" aria-label="dossier exhibits" className="flex text-md gap-4">
            {TABS.map((tab) => (
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

         <div className="flex-1">{sheets[active]}</div>
      </div>
   );
}
