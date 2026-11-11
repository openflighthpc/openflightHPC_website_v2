import { getAllProjects } from '@/lib/project-handler';
import ProjectsGallery from './ProjectsGallery';

export default async function HomePage() {
   const projects =  getAllProjects();

   return (
      <main className="mx-auto w-full max-w-7xl flex-1 px-16 py-12">
         <ProjectsGallery projects={projects} />
      </main>
   );
}
