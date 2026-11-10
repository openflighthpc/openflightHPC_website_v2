import { getAllProjects } from '@/lib/projects-handler';
import ProjectsGallery from './ProjectsGallery';

export default function HomePage() {
   const projects = getAllProjects();

   return (
      <main className="mx-auto w-full max-w-7xl px-16 py-12">

         <ProjectsGallery projects={projects} />
      </main>
   );
}
