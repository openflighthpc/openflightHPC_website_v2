import Link from 'next/link';
import { type Project } from '@/lib/projects-handler';
import { STATUS_COLOR, STATUS_TAGS } from './status';

type ProjectCardProps = {
   project: Project;
};

/**
 * A mini dossier card for cross-project references in markdown,
 * written as `[[project-id]]`.
 */
export default function ProjectCard({ project }: Readonly<ProjectCardProps>) {
   const stamp = STATUS_TAGS[project.status as keyof typeof STATUS_TAGS] ?? project.status;
   const stampColor =
      STATUS_COLOR[project.status as keyof typeof STATUS_COLOR] ?? STATUS_COLOR.archived;
   const stampAngle = ((project.name.length * 7) % 15) - 7;
   // next/link prefixes the site basePath itself — do not include it here.
   const href = `/projects/${encodeURIComponent(project.id)}/`;

   return (
      <Link
         href={href}
         className="group not-prose my-8 flex items-stretch justify-between gap-4 border border-neutral-800 bg-neutral-900/40 p-5 transition-colors hover:border-lime-400/40"
      >
         <div className="flex flex-col justify-between gap-3">
            <div>
               <div className="font-mono text-[10px] uppercase tracking-[0.35em] text-neutral-500">
                  /projects/&gt;{project.id}
               </div>
               <div className="mt-2 font-serif text-2xl font-bold tracking-tight text-white">
                  {project.name}
               </div>
               {project.description && (
                  <p className="mt-2 max-w-xl font-serif text-base italic leading-relaxed text-neutral-400">
                     {project.description}
                  </p>
               )}
            </div>

            <div className="flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-neutral-400">
               <span>langs — {project.languages.join(' · ')}</span>
               <span className="text-neutral-700">/</span>
               <span>tags — {project.tags.join(' · ')}</span>
            </div>
         </div>

         <div className="flex items-start">
            <span
               className={`select-none whitespace-nowrap border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.3em] ${stampColor}`}
               style={{ transform: `rotate(${stampAngle}deg)` }}
            >
               {stamp}
            </span>
         </div>
      </Link>
   );
}
