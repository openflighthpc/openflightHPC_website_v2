import Link from 'next/link';
import Image from 'next/image';
import { getAllProjects } from '@/lib/projects-handler';
import { ChevronRight } from 'lucide-react';

const formatDate = (date: string) => {
   const [day, month, year] = date.split('/').map(Number);

   return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
   });
};

export default function HomePage() {
   const projects = getAllProjects();

   return (
      <main className="mx-auto px-16 py-12  ">
         <h1 className="md:text-5xl sm:text-4xl text-3xl font-bold mb-3 mt-14">All Projects</h1>

         <div className="sm:max-w-7xl grid grid-cols-2  md:grid-cols-3 gap-6">
            {projects.map((project) => (
               <Link
                  key={project.name}
                  href={`/projects/${project.id}`}
                  className="group rounded-xl mt-10 hover:shadow-lg overflow-hidden transition"
               >
                  {project.logoPath && (
                     <div className="relative w-full aspect-square overflow-hidden rounded-lg border border-transparent mb-4">
                        <Image
                           src={`/openflightHPC_website_v2/${project.logoPath}`}
                           alt={`${project.name} logo`}
                           fill
                           className="object-cover scale-100 transition-transform duration-400 hover:scale-110"
                        />
                     </div>
                  )}

                  <h2 className="text-xl font-bold mb-2">{project.description}</h2>

                  <div className="flex flex-wrap gap-2 mb-4">
                     {project.tags.map((tag) => (
                        <span
                           key={tag}
                           className="text-xs text-slate-200 border border-slate-300/10 rounded-full bg-slate-600/40 px-3 py-1"
                        >
                           {tag}
                        </span>
                     ))}
                  </div>
                  <div className="flex flex-col">
                     <span className="font-light">
                        {formatDate(project.startDate)}
                        {project.status === 'in-progress'
                           ? ' - ongoing'
                           : project.endDate && project.endDate !== project.startDate
                             ? ` - ${formatDate(project.endDate)}`
                             : ''}
                     </span>

                     <span className="flex items-center transition duration-400 group-hover:translate-x-2 group-hover:text-green-400 text-sm mt-2 font-bold">
                        View project <ChevronRight />{' '}
                     </span>
                  </div>
               </Link>
            ))}
         </div>
      </main>
   );
}
