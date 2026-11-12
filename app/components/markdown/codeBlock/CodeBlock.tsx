'use client';

import { highlightCode } from '../assets/highlight';
import CopyCodeButton from './CopyCodeButton';

/**
 * Parses the metadata from the object to retrieve the filename
 * @param meta The metadata
 * @returns The parsed file name
 */
function parseFilenameFromMeta(meta: string | undefined) {
   if (!meta) return undefined;

   const match = new RegExp(/(?:^|\s)title=(?:"([^"]*)"|\{([^}]*)\}|([^\s"'}]+))/).exec(meta);
   return match?.[1] ?? match?.[2] ?? match?.[3];
}

/**
 * Server component that renders a syntax highlighted code fence.
 * The fence's info string after the language is treated as a filename
 * label, e.g. ```bash title=backup.sh
 * @param code The code to put in the code
 * @param lang The language of the code block
 * @param meta The metadata to use
 * @returns the created code block
 */
export default function CodeBlock({
   code,
   lang,
   meta
}: Readonly<{
   code: string;
   lang: string | undefined;
   meta: string | undefined;
}>) {
   return (
      <div className="not-prose my-6 overflow-hidden border border-neutral-800 bg-neutral-950">
         <div className="flex items-center justify-between gap-4 border-b border-neutral-800 bg-neutral-900/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400">
            <span className="truncate">{parseFilenameFromMeta(meta) ?? lang ?? 'text'}</span>
            <CopyCodeButton code={code} />
         </div>
         <div
            className="shiki-block"
            dangerouslySetInnerHTML={{ __html: highlightCode(code, lang) }}
         />
      </div>
   );
}
