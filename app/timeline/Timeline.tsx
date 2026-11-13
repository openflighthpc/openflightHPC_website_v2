import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

import { formatDate } from '@/app/components/markdown/assets/formatDate';
import type { TimelineItem } from '@/lib/timeline-handler';

const itemSpacing = 'pb-16';

/**
 * Renders the timeline items top down in the order given. The order must
 * already be reversed (most recent first) by the caller, and every item is
 * separated by the same fixed spacing so the line stays even regardless of
 * how far apart the items are in time.
 */
export default function Timeline({ items }: Readonly<{ items: TimelineItem[] }>) {
   return (
      <ol className="relative mt-12 flex flex-col">
         {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
               <li key={item.id} className={`flex gap-6 ${isLast ? '' : itemSpacing}`}>
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
                        {formatDate(item.kind === 'project' ? item.startDate : item.date)}
                        {item.kind === 'project' ? dateRange(item) : ''}
                     </p>
                     <h2 className="mt-2 text-2xl font-bold text-white">
                        {item.kind === 'project' ? item.name : item.title}
                     </h2>

                     {item.kind === 'project' ? (
                        <>
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
                        </>
                     ) : (
                        <div className="text-zinc-300 [&>p]:mt-2 [&_a]:underline [&_a]:text-green-300/70">
                           <ReactMarkdown>{item.content}</ReactMarkdown>
                        </div>
                     )}

                     <ItemLink item={item} />
                  </div>
               </li>
            );
         })}
      </ol>
   );
}

/** The end of the date range for a project, blank while it is in progress */
function dateRange(project: Extract<TimelineItem, { kind: 'project' }>) {
   if (project.status === 'in-progress') {
      return ' - In Progress';
   }

   if (project.endDate && project.endDate !== project.startDate) {
      return ` - ${formatDate(project.endDate)}`;
   }

   return '';
}

/** Links an item to its project page, when there is one */
function ItemLink({ item }: Readonly<{ item: TimelineItem }>) {
   const projectId = item.kind === 'project' ? item.id : item.project;

   if (!projectId) {
      return null;
   }

   return (
      <Link
         href={`/projects/${projectId}`}
         className="mt-4 inline-block text-sm font-bold text-white transition hover:text-green-400"
      >
         View project
      </Link>
   );
}
