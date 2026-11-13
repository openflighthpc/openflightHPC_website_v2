'use client';

import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';

export default function BeforeAfterSlider({
   afterAlt,
   afterLabel = 'AFTER',
   afterSrc,
   beforeAlt,
   beforeLabel = 'BEFORE',
   beforeSrc
}: Readonly<{
   beforeSrc: string;
   beforeAlt: string;
   afterSrc: string;
   afterAlt: string;
   beforeLabel?: string;
   afterLabel?: string;
}>) {
   const containerRef = useRef<HTMLDivElement>(null);
   const [isDragging, setIsDragging] = useState(false);
   const [position, setPosition] = useState(50);

   const updateFromPointer = useCallback((clientX: number) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      setPosition(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
   }, []);

   return (
      <div
         ref={containerRef}
         className="not-prose relative aspect-video max-w-full cursor-ew-resize select-none overflow-hidden rounded-sm"
         onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            setIsDragging(true);
            updateFromPointer(event.clientX);
         }}
         onPointerMove={(event) => {
            if (isDragging) updateFromPointer(event.clientX);
         }}
         onPointerUp={() => setIsDragging(false)}
         onPointerCancel={() => setIsDragging(false)}
      >
         <Image
            src={afterSrc}
            alt={afterAlt}
            fill
            draggable={false}
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 768px"
         />

         <div
            className="absolute inset-0 opacity-100"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
         >
            <Image
               src={beforeSrc}
               alt={beforeAlt}
               fill
               draggable={false}
               className="object-contain grayscale-[35%]"
               sizes="(max-width: 768px) 100vw, 768px"
            />
         </div>

         <div
            aria-hidden
            className="absolute inset-y-0 w-px bg-lime-400/70"
            style={{ left: `${position}%` }}
         />

         <button
            type="button"
            aria-label="Drag to compare before and after"
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 touch-none rounded-full border border-lime-400/60 bg-neutral-950/80 p-2 text-lime-300"
            style={{ left: `${position}%` }}
         >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
               <path d="M5 2 2 7l3 5M9 2l3 5-3 5" stroke="currentColor" strokeWidth="1.5" />
            </svg>
         </button>

         <span className="pointer-events-none absolute left-3 top-3 border border-neutral-700 bg-neutral-950/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-300">
            {beforeLabel}
         </span>
         <span className="pointer-events-none absolute right-3 top-3 border border-neutral-700 bg-neutral-950/80 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-300">
            {afterLabel}
         </span>
      </div>
   );
}
