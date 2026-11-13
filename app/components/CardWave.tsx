'use client';

export default function CardWave() {
   return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
         <svg className="h-full w-full" viewBox="0 0 288 216" preserveAspectRatio="none">
            <path
               d="M-156 108 C-117 175 -39 192 0 108 C39 24 117 24 156 108 S250 175 312 106 S429 24 468 108"
               fill="none"
               stroke="rgba(255, 255, 255, 0.15)"
               strokeWidth="28"
               transform="translate(-8 12)"
            />
         </svg>
      </div>
   );
}
