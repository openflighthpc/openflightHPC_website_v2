import type { Metadata } from 'next';
import Link from 'next/link';

import Footer from '@/app/components/Footer';

export const metadata: Metadata = {
   description: 'Where OpenFlight Labs projects have been used and the difference they made.',
   title: 'Impact'
}

type ImpactStory = {
   org: string;
   project: {
      href: string;
      name: string;
   };
   title: string;
   body: string[];
   reference: {
      href: string;
      label: string;
   } | null;
};

const stories: ImpactStory[] = [
   {
      org: 'University College London',
      project: { href: '/projects/flight_control', name: 'Flight Control' },
      title: 'Demystifying HPC for biomedical research',
      body: [
         'Working with UCL and the CompBioMed community, Flight Control was used to bring traditional-like HPC to the cloud without losing control of spend.',
         'Predicting and capping costs around cloud-based system builds meant researchers could focus on running their workloads, not managing budgets.'
      ],
      reference: null
   },
   {
      org: 'University of Liverpool',
      project: { href: '/projects/flight_solo', name: 'Flight Solo' },
      title: 'Using the cloud to fight COVID-19',
      body: [
         'Flight Solo supported a University of Liverpool COVID-19 research grant, standing up self-contained HPC environments for researchers at speed.',
         'The work contributed to genuine research breakthroughs, demonstrating how rapidly deployed cloud HPC can accelerate urgent science.'
      ],
      reference: null
   },
   {
      org: 'University of York',
      project: { href: '/projects/carbon_leaderboard', name: 'Carbon Leaderboard' },
      title: 'Ranking carbon emissions and setting the benchmark',
      body: [
         'York applied our carbon emissions ranking work to their EcoDataCenter system, and the efficiency of their infrastructure showed.',
         'Their numbers came out far ahead of comparable systems, proving that greener HPC is measurable and achievable.'
      ],
      reference: null
   },
   {
      org: 'A motorsport engineering customer',
      project: { href: '/projects/vem2', name: 'An HPC as a cloud computing model' },
      title: 'Visualisation workloads, on demand',
      body: [
         'One of our motorsport and engineering customers uses our HPC-as-a-cloud-computing-model work to run visualisation workloads on demand.',
         'Rather than owning dedicated hardware for bursty rendering jobs, they burst to cloud capacity only when the work is there.'
      ],
      reference: null
   },
   {
      org: 'CIUK Student Cluster Challenge',
      project: { href: '/projects', name: 'our R&D projects' },
      title: 'Where the next generation helps us experiment',
      body: [
         'The CIUK Student Cluster Challenge is as valuable to us as it is to the students taking part.',
         'It gives us a space for intense prototyping and testing: new ideas get pushed hard, stress-tested alongside students learning HPC and what survives feeds straight back into our research and development.'
      ],
      reference: null
   }
];

export default function ImpactPage() {
   return (
      <>
         <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-12 sm:px-16 text-white">
            <h1 className="text-4xl font-bold">Impact</h1>
            <p className="mt-4 max-w-3xl text-lg text-zinc-400">
               Our projects don&apos;t stay in the lab.
               Here&apos;s where they&apos;ve been used, and what the organisations
               using them have achieved.
            </p>

            <div className="mt-10 flex flex-col gap-10">
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
                        <p
                           key={paragraph}
                           className="mt-3 text-zinc-300"
                        >
                           {paragraph}
                        </p>
                     ))}
                     <p className="mt-4 text-sm">
                        Built on{' '}
                        <Link
                           href={story.project.href}
                           className="font-bold text-green-300/70 underline transition hover:text-green-400"
                        >
                           {story.project.name}
                        </Link>
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
               More customer stories are in the works. 
               <Link
                  href="/projects"
                  className="text-green-300/70 underline transition hover:text-green-400"
               >
               <br />
                  Browse our projects
               </Link>{' '}
               in the meantime.
            </p>
         </main>
         <Footer />
      </>
   );
}
