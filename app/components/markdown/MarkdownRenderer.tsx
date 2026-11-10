import { getAllProjects, getProject } from '@/lib/projects-handler';
import type { Element as HastElement, Text as HastText } from 'hast';
import Image from 'next/image';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import BeforeAfterSlider from './BeforeAfterSlider';
import CodeBlock from './CodeBlock';
import ProjectCard from './ProjectCard';
import { resolveImagePath } from './paths';
import { STATUS_COLOR, STATUS_TAGS } from './status';

type RendererProps = {
   projectName: string;
   StencilText?: React.FC<{ text: string; repeat?: number }>;
};

const NODE_LABELS = ['NODE', 'JOB', 'TAPE', 'RACK', 'PORT', 'ECHO', 'MOOR', 'FLUX'];

export default function MarkdownRenderer({ projectName, StencilText }: Readonly<RendererProps>) {
   const project = getProject(projectName);
   const stamp = STATUS_TAGS[project.status as keyof typeof STATUS_TAGS] ?? project.status;
   const stampColor =
      STATUS_COLOR[project.status as keyof typeof STATUS_COLOR] ?? STATUS_COLOR.archived;
   const stampAngle = ((project.name.length * 7) % 15) - 7;
   const seed = project.name.length;
   const allProjects = getAllProjects();

   const mediaComponents: Components = {
      img({ src, alt }) {
         if (typeof src !== 'string') return null;

         // A raw <video> tag falls back to the img component with the whole
         // tag leaked into `alt`, so only keep a genuine alt text.
         const altText = alt && alt !== src ? alt : '';

         if (/\.(mp4|webm|ogg|mov|m4v)$/i.test(src)) {
            return (
               <video
                  src={resolveImagePath(src, projectName)}
                  controls
                  className="max-w-full rounded-sm"
               />
            );
         }

         return (
            <Image
               src={resolveImagePath(src, projectName)}
               alt={altText}
               width={1200}
               height={800}
               className="grayscale-[35%] max-w-full h-auto rounded-sm"
               sizes="(max-width: 768px) 100vw, 768px"
            />
         );
      },
      video({ src, children }) {
         if (typeof src !== 'string') return null;

         return (
            <video
               src={resolveImagePath(src, projectName)}
               controls
               className="max-w-full rounded-sm"
            >
               {children}
            </video>
         );
      },
      pre({ node, children }) {
         // The <pre> wrapper is replaced by CodeBlock, which owns the frame,
         // so fenced code never reaches the `code` override below.
         const codeEl = node?.children.find(
            (child): child is HastElement => child.type === 'element' && child.tagName === 'code'
         );

         if (!codeEl) return <>{children}</>;

         const className = (codeEl.properties.className as string[] | undefined) ?? [];
         const lang = className
            .find((cls) => cls.startsWith('language-'))
            ?.replace('language-', '');
         // `meta` is delivered as an attribute by the remarkCodeMeta plugin,
         // with the hast node's data field as a fallback.
         const meta =
            (codeEl.properties.meta as string | undefined) ??
            (codeEl.data as { meta?: string } | undefined)?.meta;

         return <CodeBlock code={hastTextContent(codeEl)} lang={lang} meta={meta} />;
      },
      code({ className, children }) {
         const raw = String(children);

         // Inline `[[project-id]]` references render as dossier cards.
         const refMatch = !className ? raw.match(/^\[\[([a-z0-9-]+)\]\]$/i) : undefined;
         if (refMatch) {
            const referenced = allProjects.find(
               (candidate) => candidate.id.toLowerCase() === refMatch[1].toLowerCase()
            );
            if (referenced) return <ProjectCard project={referenced} />;
         }

         return <code className="font-mono text-[0.85em] text-lime-200/90">{children}</code>;
      },
      p({ node, children }) {
         // A paragraph holding only a bare `[[project-id]]` reference renders
         // as a dossier card for that project.
         const paraChildren = node?.children ?? [];
         const soleText =
            paraChildren.length === 1 && paraChildren[0].type === 'text'
               ? (paraChildren[0] as HastText)
               : undefined;
         const soleRef = soleText?.value.match(/^\[\[([a-z0-9-]+)\]\]$/i);

         if (soleRef) {
            const referenced = allProjects.find(
               (candidate) => candidate.id.toLowerCase() === soleRef[1].toLowerCase()
            );
            if (referenced) return <ProjectCard project={referenced} />;
         }

         // Two adjacent images in one paragraph whose alt text starts with
         // `before|after` collapse into a draggable comparison slider.
         const images = (node?.children ?? []).filter(
            (child): child is HastElement => child.type === 'element' && child.tagName === 'img'
         );

         if (
            images.length === 2 &&
            images.every((image) =>
               /^before\s*\|\s*after/i.test(String(image.properties.alt ?? ''))
            )
         ) {
            const [before, after] = images;
            return (
               <BeforeAfterSlider
                  beforeSrc={resolveImagePath(String(before.properties.src), projectName)}
                  beforeAlt={String(before.properties.alt)}
                  afterSrc={resolveImagePath(String(after.properties.src), projectName)}
                  afterAlt={String(after.properties.alt)}
               />
            );
         }

         return <p>{children}</p>;
      }
   };

   return (
      <div className="relative min-h-screen font-sans text-neutral-100">
         {/* ————————————————————————————————————————
          BACKDROP — the wall behind everything:
          poured concrete, one warm seam, node-rack
          labels stencilled up the dark
          ———————————————————————————————————————— */}
         <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-neutral-950" />

            {Array.from({ length: 36 }).map((_, i) => {
               const col = i % 6;
               const row = Math.trunc(i / 6);
               const left = 4 + col * 17 + ((seed * (i + 3)) % 9);
               const top = 5 + row * 13 + ((seed * (i + 5)) % 11);
               const opacity = 0.38 - row * 0.055;
               const scale = 0.9 + row * 0.04;
               const label = `${NODE_LABELS[(i + seed) % NODE_LABELS.length]}-${
                  ((seed * 31 + i * (17 + col * 13)) % 9000) + 1000
               }`;

               return (
                  <div
                     key={i}
                     className="absolute font-mono text-[10px] uppercase tracking-[0.35em] text-neutral-400"
                     style={{
                        left: `${left}%`,
                        top: `${top}%`,
                        opacity,
                        transform: `scale(${scale})`
                     }}
                  >
                     {label}
                  </div>
               );
            })}

            <div className="absolute left-0 right-[22%] top-[17%] h-px bg-neutral-800/50" />
            <div className="absolute bottom-[14rem] left-[26%] right-0 h-px bg-neutral-800/40" />
            <div className="absolute bottom-[7rem] left-[38%] right-0 h-px bg-neutral-800/30" />
         </div>

         {/* ————————————————————————————————————————
          HEADER — dossier stamp, path breadcrumb,
          the specimen title and its meta strip
          ———————————————————————————————————————— */}
         <header className="relative mx-auto max-w-4xl px-6 pb-4 pt-20 sm:px-10">
            <div className="flex items-start justify-between">
               <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-neutral-500">
                  /projects/&gt;{projectName}
               </div>

               <div
                  className={`select-none border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.3em] ${stampColor}`}
                  style={{ transform: `rotate(${stampAngle}deg)` }}
               >
                  {stamp}
               </div>
            </div>

            <div className="mt-10">
               {project.description ? (
                  <p className="max-w-2xl font-serif text-xl italic leading-relaxed text-neutral-300">
                     {project.description}
                  </p>
               ) : (
                  <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-neutral-600">
                     description on file — see exhibit below
                  </p>
               )}

               <h1 className="mt-6 font-serif text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl">
                  {project.name}
               </h1>

               <div className="mt-8 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
                  {[
                     { label: 'status', value: project.status },
                     { label: 'featured', value: project.featured ? 'yes' : 'no' },
                     { label: 'langs', value: project.languages.join(' · ') },
                     { label: 'tags', value: project.tags.join(' · ') }
                  ].map((m) => (
                     <div
                        key={m.label}
                        className="border border-neutral-800 bg-neutral-900/60 px-3 py-2"
                     >
                        <span className="text-neutral-500">{m.label}</span>
                        <span className="mx-2 text-neutral-700">/</span>
                        <span className="text-neutral-100">{m.value}</span>
                     </div>
                  ))}
               </div>
            </div>
         </header>

         {/* ————————————————————————————————————————
          STENCIL — row of repeated name stamps
          ———————————————————————————————————————— */}
         {StencilText && (
            <div className="relative mx-auto max-w-4xl px-6 pb-2 pt-14 sm:px-10">
               <StencilText text={`${project.name} specimen`} repeat={3} />
            </div>
         )}

         {/* ————————————————————————————————————————
          BODY — the reading column, with a vertical
          "rack door" rail note down the left margin
          ———————————————————————————————————————— */}
         <main className="relative mx-auto max-w-4xl px-6 sm:px-10">
            <div className="grid grid-cols-1 gap-y-16 py-20 text-lg leading-loose [grid-template-columns:1fr] lg:text-xl lg:[grid-template-columns:3rem_minmax(0,1fr)] lg:gap-x-10">
               <aside className="hidden lg:block">
                  <div className="sticky top-24 mt-2 font-mono text-[10px] uppercase tracking-[0.4em] text-neutral-600 [writing-mode:vertical-rl]">
                     reading log — open rack door
                  </div>
               </aside>

               <div className="prose prose-invert max-w-none">
                  <ReactMarkdown
                     remarkPlugins={[remarkGfm, remarkCodeMeta]}
                     components={mediaComponents}
                  >
                     {project.summary}
                  </ReactMarkdown>
                  <ReactMarkdown
                     remarkPlugins={[remarkGfm, remarkCodeMeta]}
                     components={mediaComponents}
                  >
                     {project.breakdown}
                  </ReactMarkdown>
               </div>
            </div>
         </main>

         {/* ————————————————————————————————————————
          FOOTER — the corridor ends here
          ———————————————————————————————————————— */}
         <footer className="relative border-t border-neutral-800/70">
            <div className="mx-auto flex max-w-4xl flex-col gap-4 px-6 py-12 font-mono text-[10px] uppercase tracking-[0.35em] text-neutral-500 sm:px-10">
               <div>floor {Math.max(1, Math.ceil(project.name.length / 2))} — end of corridor</div>
               <div className="flex flex-wrap items-center justify-between gap-2">
                  <span>openflight hpc / specimen files</span>
                  <span>do not feed after midnight</span>
               </div>
            </div>
         </footer>
      </div>
   );
}

type MdastNode = {
   type: string;
   meta?: string;
   data?: { hProperties?: Record<string, string> };
   children?: MdastNode[];
};

/**
 * Copies a fenced code block's info-string meta into `data.hProperties` so
 * it survives into the hast `code` element's properties, e.g.
 * ```bash title=backup.sh → properties.meta === 'title=backup.sh'.
 */
function remarkCodeMeta() {
   return (tree: unknown) => {
      const visitNode = (node: MdastNode) => {
         if (node.type === 'code' && node.meta) {
            node.data = { ...node.data, hProperties: { meta: node.meta } };
         }
         node.children?.forEach(visitNode);
      };
      visitNode(tree as MdastNode);
   };
}

function hastTextContent(node: HastElement): string {
   return node.children
      .map((child) =>
         child.type === 'text'
            ? child.value
            : child.type === 'element'
              ? hastTextContent(child)
              : ''
      )
      .join('');
}
