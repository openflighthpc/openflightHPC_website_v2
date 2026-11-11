'use client';

import { useState } from 'react';

type SheetKey = 'summary' | 'breakdown';

type DossierTabsProps = {
   summarySheet: React.ReactNode;
   breakdownSheet: React.ReactNode;
};

const TABS: { key: SheetKey; index: string; label: string }[] = [
   { key: 'summary', index: '01', label: 'summary' },
   { key: 'breakdown', index: '02', label: 'breakdown' }
];

export default function DossierTabs({ summarySheet, breakdownSheet }: Readonly<DossierTabsProps>) {
   const [active, setActive] = useState<SheetKey>('summary');

   const sheets: Record<SheetKey, React.ReactNode> = {
      summary: summarySheet,
      breakdown: breakdownSheet
   };

   return (
      <div className="flex flex-col gap-0">
         <div
            role="tablist"
            aria-label="dossier exhibits"
            className="flex items-end gap-2 font-mono text-[10px] uppercase tracking-[0.3em]"
         >
            {TABS.map((tab) => (
               <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={active === tab.key}
                  onClick={() => setActive(tab.key)}
                  className={`cursor-pointer border border-b-0 px-4 py-2 transition-colors ${
                     active === tab.key
                        ? 'border-neutral-600 bg-neutral-800 text-neutral-100'
                        : 'border-neutral-800 bg-transparent text-neutral-500 hover:border-neutral-700 hover:text-neutral-300'
                  }`}
               >
                  <span className="text-neutral-700">{tab.index}</span>
                  <span className="mx-1.5 text-neutral-700">/</span>
                  {tab.label}
               </button>
            ))}
         </div>

         <div className="flex-1">{sheets[active]}</div>
      </div>
   );
}
