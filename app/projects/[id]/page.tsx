import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import Footer from '@/app/components/Footer';
import MarkdownRenderer from '@/app/components/markdown/MarkdownRenderer';
import { getAllProjects } from '@/lib/project-handler';

/**
 * Formats date to a formatted style
 * @param date The date to format
 * @returns The formatted date
 */
const formatDate = (date: string) => {
   const [day, month, year] = date.split('/').map(Number);

   return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
      year: 'numeric'
   });
};

const projectGradients = [
   'linear-gradient(135deg, #166534 0%, #0f766e 55%, #164e63 100%)',
   'linear-gradient(45deg, #6d28d9 0%, #9333ea 50%, #be185d 100%)',
   'linear-gradient(225deg, #c2410c 0%, #ea580c 55%, #b45309 100%)',
   'linear-gradient(315deg, #1d4ed8 0%, #2563eb 50%, #0e7490 100%)',
   'linear-gradient(90deg, #a16207 0%, #ca8a04 50%, #b45309 100%)',
   'linear-gradient(270deg, #0f766e 0%, #059669 50%, #3f6212 100%)',
   'linear-gradient(160deg, #be185d 0%, #db2777 50%, #7e22ce 100%)',
   'linear-gradient(20deg, #0e7490 0%, #0891b2 50%, #1d4ed8 100%)',
   'linear-gradient(200deg, #9a3412 0%, #c2410c 50%, #be123c 100%)',
   'linear-gradient(340deg, #4f46e5 0%, #7c3aed 50%, #a21caf 100%)'
];

function StencilText({
   repeat = 1,
   text
}: Readonly<{
   text: string;
   repeat?: number;
}>) {
   const rows = Array.from({ length: repeat });
   const doubled = `${text.toUpperCase()} ${text.toUpperCase()}`;

   return (
      <div aria-hidden className="pointer-events-none select-none whitespace-nowrap">
         {rows.map((_, i) => (
            <div
               key={i}
               className="font-mono text-[10px] font-bold tracking-[0.3em] text-neutral-700"
            >
               {doubled}
            </div>
         ))}
      </div>
   );
}

export function generateStaticParams() {
   return getAllProjects().map((project) => ({
      id: project.id
   }));
}

function getRandomProjects(id: string, count = 3) {
   return getAllProjects()
      .filter((project) => project.id !== id)
      .toSorted(() => Math.random() - 0.5)
      .slice(0, count);
}

export default async function ProjectPage({
   params
}: Readonly<{ params: Promise<{ id: string }> }>) {
   const { id } = await params;

   return (
      <>
         <MarkdownRenderer projectName={id} stencilText={StencilText} />
         <div className="relative z-10 mb-16 w-full px-4 sm:px-8 lg:px-20 max-w-7xl m-auto">
            <hr className="text-neutral-800" />
            <div className="mt-6 flex justify-between">
               <p className="text-white font-bold text-2xl">Keep reading</p>
               <Link href="/projects" className="text-xl transition hover:text-white/80 text-white">
                  View all
               </Link>
            </div>
            <section
               aria-label="More projects"
               tabIndex={0}
               className="mt-10 flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0 lg:snap-none"
            >
               {getRandomProjects(id).map((project, index) => (
                  <Link
                     key={project.id}
                     href={`/projects/${project.id}`}
                     className="group min-h-[32rem] w-72 max-w-full shrink-0 snap-start rounded-xl transition hover:shadow-lg lg:min-h-0 lg:w-auto lg:min-w-0"
                  >
                     {project.logoPath ? (
                        <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-4">
                           <Image
                              src={`/openflightHPC_website_v2/${project.logoPath}`}
                              alt={`${project.name} logo`}
                              fill
                              className="object-cover scale-100 transition-transform duration-400 hover:scale-110"
                           />
                        </div>
                     ) : (
                        <div
                           className="relative w-full duration-400 transition hover:brightness-80 aspect-square overflow-hidden rounded-lg mb-4"
                           style={{
                              backgroundImage: projectGradients[index % projectGradients.length]
                           }}
                        />
                     )}

                     <h2 className="text-xl font-bold mb-2">{project.description}</h2>

                     <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.map((tag) => (
                           <span
                              key={tag}
                              className="xtext-xs text-slate-200 border border-slate-300/10 rounded-full bg-slate-600/40 px-3 py-1"
                           >
                              {tag}
                           </span>
                        ))}
                     </div>
                     <div className="flex flex-col">
                        <span className="font-light">
                           {formatDate(project.startDate)}
                           {project.status === 'in-progress'
                              ? ' - In Progress'
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
            </section>
         </div>
         <Footer />
      </>
   );
}
