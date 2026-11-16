import Link from 'next/link';

import { formatDate } from '@/lib/date-formatter';
import { Project } from '@/lib/metadata-handler';

/**
 * Renders the timeline items top down in the order given. The order must
 * already be reversed (most recent first) by the caller, and every item is
 * separated by the same fixed spacing so the line stays even regardless of
 * how far apart the items are in time.
 */
export default function Timeline({ items }: Readonly<{ items: Project[] }>) {
   return (
      <ol className="mx-auto mt-12 w-full max-w-5xl">
         {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const isLeft = index % 2 === 0;

            return (
               <li
                  key={item.id}
                  className={`relative grid grid-cols-[1rem_minmax(0,1fr)] gap-x-6 gap-y-3 md:grid-cols-[minmax(0,1fr)_1rem_minmax(0,1fr)] md:gap-x-8 md:gap-y-0 ${isLast ? '' : 'pb-16'}`}
               >
                  {!isLast && (
                     <span
                        aria-hidden="true"
                        className="absolute -bottom-4 left-2 top-4 w-px bg-neutral-700 md:left-1/2 md:-translate-x-1/2"
                     />
                  )}
                  <span
                     aria-hidden="true"
                     className="timeline-node relative z-10 col-start-1 row-start-1 mt-2 h-4 w-4 rounded-full border-2 border-black md:col-start-2"
                     style={{ backgroundColor: item.colour }}
                  />

                  <div
                     className={`col-start-2 row-start-1 mt-1 min-w-0 text-md font-medium tracking-wide text-white ${isLeft ? 'md:col-start-3' : 'md:col-start-1'}`}
                  >
                     <p
                        className={`w-fit rounded-full border p-2 ${isLeft ? '' : 'md:ml-auto md:text-right'}`}
                        style={{
                           backgroundColor: `color-mix(in srgb, ${item.colour} 40%, transparent)`,
                           borderColor: item.colour
                        }}
                     >
                        {formatDate(item.startDate)}
                        {dateRange(item)}
                     </p>
                  </div>

                  <Link
                   href={`/projects/${item.id}`}
                     className={`col-start-2 cursor-pointer group border border-transparent transition duration-400 hover:border-green-900 row-start-2 min-w-0 rounded-xl bg-neutral-600/30 p-4 md:row-start-1 ${isLeft ? 'md:col-start-1 md:text-right' : 'md:col-start-3'}`}
                  >
                     <p className="text-white">{item.description}</p>

                     <div className={`mt-3 flex flex-wrap gap-2 ${isLeft ? 'md:justify-end' : ''}`}>
                        {item.tags.map((tag) => (
                           <span
                              key={tag}
                              className="text-xs text-slate-200 border border-slate-300/10 rounded-full bg-slate-600/40 px-3 py-1"
                           >
                              {tag}
                           </span>
                        ))}
                     </div>

                     <p
                       
                        className="mt-4 inline-block text-sm font-bold text-white transition group-hover:text-green-400"
                     >
                        View project
                     </p>
                  </Link>
               </li>
            );
         })}
      </ol>
   );
}

/** The end of the date range for a project, blank while it is in progress */
function dateRange(project: Project) {
   if (project.status === 'in-progress') {
      return ' - In Progress';
   }

   if (project.endDate && project.endDate !== project.startDate) {
      return ` - ${formatDate(project.endDate)}`;
   }

   return '';
}
