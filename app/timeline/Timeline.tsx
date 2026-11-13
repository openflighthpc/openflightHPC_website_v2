import Link from 'next/link';

import { formatDate } from '@/app/components/markdown/assets/formatDate';
import type { Project } from '@/lib/project-handler';

const itemSpacing = 'pb-16';

/**
 * Renders every project as a vertical timeline flowing top down.
 * The order must already be reversed (most recent first) by the caller, and
 * every project is separated by the same fixed spacing so the line stays even
 * regardless of how far apart the projects are in time.
 */
export default function Timeline({ projects }: Readonly<{ projects: Project[] }>) {
   return (
      <ol className="relative mt-12 flex flex-col">
         {projects.map((project, index) => {
            const isLast = index === projects.length - 1;

            return (
               <li key={project.id} className={`flex gap-6 ${isLast ? '' : itemSpacing}`}>
                  <div className="flex flex-col items-center">
                     {/* Line node, coloured per project */}
                     <span
                        aria-hidden="true"
                        className="mt-2 h-4 w-4 shrink-0 rounded-full border-2 border-black"
                        style={{ backgroundColor: project.colour }}
                     />

                     {/* Connector to the next project */}
                     {!isLast && <div aria-hidden="true" className="w-px flex-1 bg-neutral-700" />}
                  </div>

                  <div className="min-w-0 max-w-2xl">
                     <p className="text-sm font-medium tracking-wide text-zinc-400">
                        {formatDate(project.startDate)}
                        {project.status === 'in-progress'
                           ? ' - In Progress'
                           : project.endDate && project.endDate !== project.startDate
                             ? ` - ${formatDate(project.endDate)}`
                             : ''}
                     </p>

                     <h2 className="mt-2 text-2xl font-bold text-white">{project.name}</h2>

                     <p className="mt-2 text-zinc-300">{project.description}</p>

                     <div className="mt-3 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                           <span
                              key={tag}
                              className="text-xs text-slate-200 border border-slate-300/10 rounded-full bg-slate-600/40 px-3 py-1"
                           >
                              {tag}
                           </span>
                        ))}
                     </div>

                     <Link
                        href={`/projects/${project.id}`}
                        className="mt-4 inline-block text-sm font-bold text-white transition hover:text-green-400"
                     >
                        View project
                     </Link>
                  </div>
               </li>
            );
         })}
      </ol>
   );
}
