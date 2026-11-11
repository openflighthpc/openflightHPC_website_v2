'use client';

import { useState } from 'react';

type SpoilerProps = {
   children: React.ReactNode;
};

/**
 * Spoilered inline content — `||…||` in markdown — blurred until the
 * reader clicks it. The reveal is one way; reload the page to hide it
 * again. A span with button semantics rather than a real <button> so
 * spoilered `<video controls>` stays inside valid HTML.
 */
export default function Spoiler({ children }: Readonly<SpoilerProps>) {
   const [revealed, setRevealed] = useState(false);
   const reveal = () => setRevealed(true);

   return (
      <span
         role="button"
         tabIndex={0}
         aria-label="Spoiler — activate to reveal"
         onClick={reveal}
         onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
               event.preventDefault();
               reveal();
            }
         }}
         className={
            'relative mx-1 inline-block align-middle transition-all duration-200 ' +
            // Media in a spoiler keeps its full size and lands on its own
            // line; its margin lives outside the clipped box, so the blur
            // never spills onto it.
            'has-[img]:my-6 has-[video]:my-6 ' +
            (revealed
               ? 'rounded-sm'
               : 'cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-1 focus-visible:outline-lime-400/70 focus-visible:outline-offset-2')
         }
      >
         {/* Clip keeps the blur inside the box so adjacent spoilers' glows
             never bleed into each other. */}
         <span className="block overflow-hidden rounded-sm">
            <span
               className={
                  revealed
                     ? 'transition-all duration-200'
                     : 'select-none blur-xl [transform:scale(1.15)] brightness-[0.35] transition-all duration-200'
               }
            >
               {children}
            </span>
         </span>
         {!revealed && (
            <span
               aria-hidden
               className="absolute inset-0 z-10 rounded-sm bg-neutral-900/80 transition-opacity hover:bg-neutral-900/60"
            />
         )}
      </span>
   );
}
