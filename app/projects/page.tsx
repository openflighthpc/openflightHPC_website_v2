import Link from 'next/link';
import Image from 'next/image';
import { getAllProjects } from '@/lib/projects-handler';

export default function HomePage() {
   const projects = getAllProjects();

   return (
      <main className="mx-auto max-w-7xl px-6 py-12">
         <h1 className="text-4xl font-bold mb-3">My Projects</h1>

         <p className="text-gray-500 mb-10">Explore the projects I&apos;ve been working on.</p>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
               <Link
                  key={project.name}
                  href={`/projects/${project.name}`}
                  className="group rounded-xl border p-5 hover:shadow-lg transition"
               >
                  {project.logoPath && (
                     <Image
                        src={`/openflightHPC_website_v2/${project.logoPath}`.trimEnd()}
                        alt={`${project.name} logo`}
                        width={600}
                        height={300}
                        className="w-full h-40 object-contain mb-4"
                     />
                  )}

                  <h2 className="text-xl font-semibold mb-2">{project.name}</h2>

                  <p className="text-gray-600 mb-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                     {project.tags.map((tag) => (
                        <span key={tag} className="text-xs rounded-full bg-gray-600 px-3 py-1">
                           {tag}
                        </span>
                     ))}
                  </div>

                  <span className="text-sm font-medium">View project →</span>
               </Link>
            ))}
         </div>
      </main>
   );
}
