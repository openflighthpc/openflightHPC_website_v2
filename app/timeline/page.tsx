import type { Metadata } from 'next';

import Footer from '@/app/components/Footer';
import { getTimelineItems } from '@/lib/timeline-handler';

import Timeline from './Timeline';

export const metadata: Metadata = {
   description: 'Projects and milestones from OpenFlight Labs, most recent first.',
   title: 'Timeline'
};

export default function TimelinePage() {
   // The timeline handler merges the projects and markdown entries, newest first
   return (
      <>
         <main className="mx-auto w-full max-w-7xl flex-1 px-6 sm:px-16 py-12">
            <h1 className="mt-14 text-4xl font-bold sm:text-4xl md:text-5xl">Timeline</h1>
            <p className="mt-3 text-lg text-zinc-400">
               Projects and milestones from the lab, most recent first.
            </p>
            <Timeline items={getTimelineItems()} />
         </main>
         <Footer />
      </>
   );
}
