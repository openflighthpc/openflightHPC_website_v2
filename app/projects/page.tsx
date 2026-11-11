import Footer from '@/app/components/Footer';
import { getAllProjects } from '@/lib/project-handler';

import ProjectsGallery from './ProjectsGallery';

export default function HomePage() {
   const projects = getAllProjects();

   return (
      <>
         <main className="mx-auto w-full max-w-7xl flex-1 px-6 sm:px-16 py-12">
            <ProjectsGallery projects={projects} />
         </main>
         <Footer />
      </>
   );
}
