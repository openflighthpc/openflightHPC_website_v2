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
      <ol className="relative mt-12 flex flex-col">
         {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
               <li key={item.id} className={`flex gap-6 ${isLast ? '' : 'pb-16'}`}>
                  <div className="flex flex-col items-center">
                     {/* Line node, coloured per item */}
                     <span
                        aria-hidden="true"
                        className="mt-2 h-4 w-4 shrink-0 rounded-full border-2 border-black"
                        style={{ backgroundColor: item.colour }}
                     />

                     {/* Connector to the next item */}
                     {!isLast && <div aria-hidden="true" className="w-px flex-1 bg-neutral-700" />}
                  </div>

                  <div className="min-w-0 max-w-2xl">
                     <p className="text-sm font-medium tracking-wide text-zinc-400">
                        {formatDate(item.startDate)}
                        {dateRange(item)}
                     </p>
                     <p className="mt-2 text-zinc-300">{item.description}</p>

                     <div className="mt-3 flex flex-wrap gap-2">
                        {item.tags.map((tag) => (
                           <span
                              key={tag}
                              className="text-xs text-slate-200 border border-slate-300/10 rounded-full bg-slate-600/40 px-3 py-1"
                           >
                              {tag}
                           </span>
                        ))}
                     </div>

                     <Link
                        href={`/projects/${item.id}`}
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
