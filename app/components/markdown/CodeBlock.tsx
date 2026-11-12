import CopyCodeButton from './CopyCodeButton';
import { highlightCode } from './highlight';

type CodeBlockProps = {
   code: string;
   lang: string | undefined;
   meta: string | undefined;
};

/**
 * Server component that renders a syntax highlighted code fence.
 * The fence's info string after the language is treated as a filename
 * label, e.g. ```bash title=backup.sh
 */
export default function CodeBlock({ code, lang, meta }: Readonly<CodeBlockProps>) {
   const filename = parseFilenameFromMeta(meta);
   const html = highlightCode(code, lang);

   return (
      <div className="not-prose my-6 overflow-hidden border border-neutral-800 bg-neutral-950">
         <div className="flex items-center justify-between gap-4 border-b border-neutral-800 bg-neutral-900/60 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400">
            <span className="truncate">{filename ?? lang ?? 'text'}</span>
            <CopyCodeButton code={code} />
         </div>
         <div
            className="shiki-block"
            // shiki output is generated from static, trusted markdown content
            dangerouslySetInnerHTML={{ __html: html }}
         />
      </div>
   );
}

function parseFilenameFromMeta(meta: string | undefined) {
   if (!meta) return undefined;

   // Accepts a bare filename (`title=prolog.sh`), a quoted one
   // (`title="prolog.sh"`) or a braced one (`title={prolog.sh}`).
   const match = new RegExp(/(?:^|\s)title=(?:"([^"]*)"|\{([^}]*)\}|([^\s"'}]+))/).exec(meta);
   return match?.[1] ?? match?.[2] ?? match?.[3];
}
