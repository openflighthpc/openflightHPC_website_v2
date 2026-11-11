import type { Project } from '@/lib/project-handler';

import DossierTabs from './DossierTabs';
import { STATUS_TAGS } from './status';

type LayoutProps = {
   project: Project;
   StencilText?: React.FC<{ text: string; repeat?: number }>;
   summary: React.ReactNode;
   breakdown: React.ReactNode;
};

const formatDate = (date: string) => {
   const [day, month, year] = date.split('/').map(Number);

   return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
      year: 'numeric'
   });
};

function DossierSheet({
   children
}: Readonly<{
   index: string;
   title: string;
   children: React.ReactNode;
}>) {
   return (
      <section className="pb-24 shadow-[0_1.5rem_3rem_-1rem_rgba(0,0,0,0.9)]">
         <div className="prose prose-invert  max-w-none mt-6 sm:mt-10">{children}</div>
      </section>
   );
}

/**
 * Template for the actual pages
 */
export default function ProjectDossierLayout({
   breakdown,

   project,
   summary
}: Readonly<LayoutProps>) {
   const stamp = STATUS_TAGS[project.status as keyof typeof STATUS_TAGS] ?? project.status;

   return (
      <div className="relative flex-1 font-sans text-neutral-100">
         {/* ————————————————————————————————————————
          BACKDROP — the wall behind everything:
          poured concrete, one warm seam, node-rack
          labels stencilled up the dark
          ———————————————————————————————————————— */}

         <header className="relative mx-auto max-w-4xl px-6 pb-4 pt-20 sm:px-10">
            <div className="mt-10 text-center">
               <div className="flex font-bold justify-center gap-2">
                  {formatDate(project.startDate)}
                  {project.status === 'in-progress'
                     ? ' - In Progress'
                     : project.endDate && project.endDate !== project.startDate
                       ? ` - ${formatDate(project.endDate)}`
                       : ''}
                  {project.status !== 'in-progress' && <p className="font-light">{stamp}</p>}
               </div>

               <h1 className="mt-6 tracking-wide text-center text-4xl sm:text-5xl font-bold leading-[1.05]  text-white sm:text-6xl">
                  {project.description}
               </h1>

               <div className="mt-8 flex justify-center flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
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

         {/* 
         Main body including both the summary and breakdown in their own tabs
         See ./DossierTabs.tsx for more info
          */}
         <main className="relative mx-auto max-w-6xl px-6 sm:px-10">
            <div className="grid grid-cols-1 gap-y-16 mt-14 text-lg leading-loose [grid-template-columns:1fr] lg:text-xl lg:[grid-template-columns:3rem_minmax(0,1fr)] lg:gap-x-10">
               <aside className="hidden lg:block"></aside>

               <DossierTabs
                  summarySheet={
                     <DossierSheet index="01" title="summary">
                        {summary}
                     </DossierSheet>
                  }
                  breakdownSheet={
                     breakdown ? (
                        <DossierSheet index="02" title="breakdown">
                           {breakdown}
                        </DossierSheet>
                     ) : null
                  }
               />
            </div>
         </main>
      </div>
   );
}
