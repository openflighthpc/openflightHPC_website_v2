'use client';

import { useState } from 'react';

/**
 * The reader-facing side of the `:::tabs` feature. The `tabset` element
 * arriving from hast carries its labels in `data-labels`
 * (`First | Second | Third`) and one child per panel, in panel order.
 *
 * The markdown pipeline renders inside a server component, so the panel
 * children cross the RSC boundary as opaque server nodes: no inspection
 * or filtering is possible here. The plugin guarantees a `tabset`'s
 * children are exactly its panels, so they are used by position — every
 * panel renders and all but the active one are hidden, which also keeps
 * inactive panels' players and code fences alive between switches.
 */
export default function MarkdownTabs({
   children,
   'data-labels': dataLabels
}: Readonly<{
   'data-labels'?: string;
   children?: React.ReactNode;
}>) {
   const labels = (dataLabels ?? '')
      .split('|')
      .map((label) => label.trim())
      .filter(Boolean);

   // `addChildren` in hast-util-to-jsx-runtime unwraps single-child
   // lists, and flight may interleave whitespace text — normalise to a
   // flat list of real children.
   const panels = (Array.isArray(children) ? children : [children]).filter(
      (child) => typeof child !== 'string' || child.trim().length > 0
   );

   const [active, setActive] = useState(0);

   if (!labels.length || panels.length === 0) {
      return <div>{children}</div>;
   }

   const activeIndex = Math.min(active, panels.length - 1);

   return (
      <div className="flex flex-col gap-3 my-6">
         <div role="tablist" aria-label="tabbed content" className="flex gap-4 text-md">
            {labels.map((label, index) => (
               <button
                  key={`${label}-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={activeIndex === index}
                  onClick={() => setActive(index)}
                  className={`cursor-pointer border-b-2 pb-1 transition-colors ${
                     activeIndex === index
                        ? 'border-neutral-600 font-bold text-neutral-100'
                        : 'border-transparent bg-transparent text-neutral-500 hover:text-neutral-300'
                  }`}
               >
                  {label}
               </button>
            ))}
         </div>
         {panels.map((panel, index) => (
            <div key={index} role="tabpanel" hidden={index !== activeIndex}>
               {panel}
            </div>
         ))}
      </div>
   );
}
