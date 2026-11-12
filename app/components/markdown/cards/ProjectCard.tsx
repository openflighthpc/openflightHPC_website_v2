'use client';

import Link from 'next/link';

import { type Project } from '@/lib/project-handler';

import { STATUS_TAGS } from '../assets/status';

const formatDate = (date: string) => {
   const [day, month, year] = date.split('/').map(Number);

   return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
      year: 'numeric'
   });
};

/**
 * A mini dossier card for cross-project references in markdown,
 * written as `[[project-id]]`.
 */
export default function ProjectCard({
   project
}: Readonly<{
   project: Project;
}>) {
   const status = STATUS_TAGS[project.status as keyof typeof STATUS_TAGS] ?? project.status;
   const dateRange =
      project.status === 'in-progress'
         ? `${formatDate(project.startDate)} - In Progress`
         : project.endDate && project.endDate !== project.startDate
           ? `${formatDate(project.startDate)} - ${formatDate(project.endDate)}`
           : formatDate(project.startDate);
   // next/link prefixes the site basePath itself — do not include it here.
   const href = `/projects/${encodeURIComponent(project.id)}/`;

   return (
      <Link
         href={href}
         className="group not-prose my-8 block border border-neutral-800 bg-neutral-900/40 px-6 py-8 text-neutral-100 shadow-[0_1.5rem_3rem_-1rem_rgba(0,0,0,0.9)] transition-colors hover:border-lime-400/40 sm:px-10"
      >
         <div className="text-center max-w-2xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-2">
               <span className="font-bold">{dateRange}</span>
               {project.status !== 'in-progress' && <span className="font-light">{status}</span>}
            </div>

            <p className="mt-6 text-center text-4xl font-bold leading-[1.05] tracking-wide text-white sm:text-5xl">
               {project.description}
            </p>
         </div>

         <div className="mt-8 flex flex-wrap justify-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
            {[
               { label: 'status', value: project.status },
               { label: 'featured', value: project.featured ? 'yes' : 'no' },
               { label: 'languages', value: project.languages.join(' · ') },
               { label: 'tags', value: project.tags.join(' · ') }
            ].map(({ label, value }) => (
               <div key={label} className="border border-neutral-800 bg-neutral-900/60 px-3 py-2">
                  <span className="text-neutral-500">{label}</span>
                  <span className="mx-2 text-neutral-700">/</span>
                  <span className="text-neutral-100">{value}</span>
               </div>
            ))}
         </div>
      </Link>
   );
}
