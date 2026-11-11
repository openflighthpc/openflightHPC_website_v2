import type { Project } from '@/lib/projects-handler';
import { STATUS_COLOR, STATUS_TAGS } from './status';

type LayoutProps = {
   project: Project;
   StencilText?: React.FC<{ text: string; repeat?: number }>;
   children: React.ReactNode;
};

const formatDate = (date: string) => {
   const [day, month, year] = date.split('/').map(Number);

   return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
   });
};

const NODE_LABELS = ['NODE', 'JOB', 'TAPE', 'RACK', 'PORT', 'ECHO', 'MOOR', 'FLUX'];

/**
 * Presentational page shell for a project dossier: backdrop, header,
 * dossier stamp, stencil strip, reading column and footer. All page
 * styling lives here — the custom markdown behaviour lives in
 * `markdown-components.tsx` and is fed in as `children`.
 */
export default function ProjectDossierLayout({
   project,
   StencilText,
   children
}: Readonly<LayoutProps>) {
   const stamp = STATUS_TAGS[project.status as keyof typeof STATUS_TAGS] ?? project.status;
   const stampColor =
      STATUS_COLOR[project.status as keyof typeof STATUS_COLOR] ?? STATUS_COLOR.archived;
   const stampAngle = ((project.name.length * 7) % 15) - 7;
   const seed = project.name.length;

   return (
      <div className="relative min-h-screen font-sans text-neutral-100">
         {/* ————————————————————————————————————————
          BACKDROP — the wall behind everything:
          poured concrete, one warm seam, node-rack
          labels stencilled up the dark
          ———————————————————————————————————————— */}
  

         {/* ————————————————————————————————————————
          HEADER — dossier stamp, path breadcrumb,
          the specimen title and its meta strip
          ———————————————————————————————————————— */}
         <header className="relative mx-auto max-w-4xl px-6 pb-4 pt-20 sm:px-10">
         

            <div className="mt-10 text-center">
               <div className='flex justify-center gap-4'>
                  <p className='font-bold'>{formatDate(project.startDate)} - {formatDate(project.endDate)}</p>
                  <p>{stamp}</p>
               
               </div>
               {/* {project.description ? (
                  <p className="max-w-2xl  text-xl leading-relaxed text-neutral-400">
                     {project.description}
                  </p>
               ) : (
                  <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-neutral-600">
                     description on file — see exhibit below
                  </p>
               )} */}

               <h1 className="mt-6 tracking-wide text-center text-5xl font-bold leading-[1.05]  text-white sm:text-6xl">
                  {project.description}
               </h1>

               <div className="mt-8 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
                  {[
                     { label: 'status', value: project.status },
                     { label: 'featured', value: project.featured ? 'yes' : 'no' },
                     { label: 'languages', value: project.languages.join(' · ') },
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
         {/* {StencilText && (
            <div className="relative mx-auto max-w-4xl px-6 pb-2 pt-14 sm:px-10">
               <StencilText text={`${project.name} specimen`} repeat={3} />
            </div>
         )} */}

         {/* ————————————————————————————————————————
          BODY — the reading column, with a vertical
          "rack door" rail note down the left margin
          ———————————————————————————————————————— */}
         <main className="relative mx-auto max-w-6xl px-6 sm:px-10">
            <div className="grid grid-cols-1 gap-y-16 py-20 text-lg leading-loose [grid-template-columns:1fr] lg:text-xl lg:[grid-template-columns:3rem_minmax(0,1fr)] lg:gap-x-10">
               <aside className="hidden lg:block">
                
               </aside>

               <div className="prose prose-invert max-w-none">{children}</div>
            </div>
         </main>

         {/* ————————————————————————————————————————
          FOOTER — the corridor ends here
          ———————————————————————————————————————— */}
         {/* <footer className="relative border-t border-neutral-800/70">
            <div className="mx-auto flex max-w-4xl flex-col gap-4 px-6 py-12 font-mono text-[10px] uppercase tracking-[0.35em] text-neutral-500 sm:px-10">
               <div>floor {Math.max(1, Math.ceil(project.name.length / 2))} — end of corridor</div>
               <div className="flex flex-wrap items-center justify-between gap-2">
                  <span>openflight hpc / specimen files</span>
                  <span>do not feed after midnight</span>
               </div>
            </div>
         </footer> */}
      </div>
   );
}
