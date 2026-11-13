import Footer from '@/app/components/Footer';
import { getAllProjects } from '@/lib/project-handler';

import Timeline from './Timeline';

/** Converts a dd/mm/yyyy date into a comparable UTC timestamp */
const dateValue = (date: string) => {
   const [day, month, year] = date.split('/').map(Number);
   return Date.UTC(year, month - 1, day);
};

export default function TimelinePage() {
   // Reverse order: the most recent project sits at the top of the timeline
   const projects = getAllProjects().toSorted(
      (a, b) => dateValue(b.startDate) - dateValue(a.startDate)
   );

   return (
      <>
         <main className="mx-auto w-full max-w-7xl flex-1 px-6 sm:px-16 py-12">
            <h1 className="mt-14 text-4xl font-bold sm:text-4xl md:text-5xl">Timeline</h1>
            <p className="mt-3 text-lg text-zinc-400">Every lab project, most recent first.</p>
            <Timeline projects={projects} />
         </main>
         <Footer />
      </>
   );
}
