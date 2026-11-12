'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Client component that renders a copy-to-clipboard button in a code block header.
 * Shows "copied" for 1.5s after a successful copy, then reverts.
 * @param code The raw code text written to the clipboard
 * @returns the created copy button
 */
export default function CopyCodeButton({ code }: Readonly<{ code: string }>) {
   const [copied, setCopied] = useState(false);
   const timeout = useRef<number | undefined>(undefined);

   useEffect(() => () => window.clearTimeout(timeout.current), []);

   return (
      <button
         type="button"
         className="shrink-0 border border-neutral-700 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400 transition hover:border-lime-400/50 hover:text-lime-300"
         onClick={async () => {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            window.clearTimeout(timeout.current);
            timeout.current = window.setTimeout(() => setCopied(false), 1500);
         }}
      >
         {copied ? 'copied' : 'copy'}
      </button>
   );
}
