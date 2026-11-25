import type { Metadata } from 'next';
import Link from 'next/link';

import Footer from '@/app/components/Footer';
import { getAllImpactStories } from '@/lib/impact-handler';

export const metadata: Metadata = {
   description: 'Where OpenFlight Labs projects have been used and the difference they made.',
   title: 'Impact'
};

export default function ImpactPage() {
   const stories = getAllImpactStories();

   return (
      <>
         <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12 sm:px-16 text-white">
            <h1 className="text-center text-4xl font-bold">Impact</h1>
            <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-zinc-400">
               Our projects don&apos;t stay in the lab. Here&apos;s where they&apos;ve been used,
               and what the organisations using them have achieved.
            </p>

            <div className="mt-10 flex flex-col items-center gap-10">
               {stories.map((story) => (
                  <article
                     key={story.title}
                     className="max-w-3xl rounded-2xl bg-white/5 p-6 sm:p-8"
                  >
                     <p className="text-sm font-semibold uppercase tracking-widest text-green-400/70">
                        {story.org}
                     </p>
                     <h2 className="mt-2 text-2xl font-bold">{story.title}</h2>
                     {story.body.map((paragraph) => (
                        <p key={paragraph} className="mt-3 text-zinc-300">
                           {paragraph}
                        </p>
                     ))}
                     <p className="mt-4 text-sm">
                        {story.project && (
                           <>
                              Built on{' '}
                              <Link
                                 href={story.project.href}
                                 className="font-bold text-green-300/70 underline transition hover:text-green-400"
                              >
                                 {story.project.name}
                              </Link>
                           </>
                        )}
                        {story.reference && (
                           <>
                              {' · '}
                              <a
                                 target="_blank"
                                 rel="noopener"
                                 href={story.reference.href}
                                 className="text-zinc-400 underline transition hover:text-white"
                              >
                                 {story.reference.label}
                              </a>
                           </>
                        )}
                     </p>
                  </article>
               ))}
            </div>

            <p className="mt-10 max-w-3xl text-zinc-400">
               More customer stories are in the works.{' '}
               <Link
                  href="/projects"
                  className="text-green-300/70 underline transition hover:text-green-400"
               >
                  Browse our projects
               </Link>{' '}
               meanwhile.
            </p>
         </main>
         <Footer />
      </>
   );
}
