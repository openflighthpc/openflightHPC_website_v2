import Image from 'next/image';
import Marquee from 'react-fast-marquee';
import Link from 'next/link';

const projects = [
   {
      coverTitle: 'Cloud Workflows',
      title: 'A new way to build cloud workflows',
      date: 'Nov 6, 2026',
      dateTime: '2026-11-06',
      color: 'bg-[#1b8a62]'
   },
   {
      coverTitle: 'Open Compute',
      title: 'Making compute more accessible',
      date: 'Oct 30, 2026',
      dateTime: '2026-10-30',
      color: 'bg-[#7d57b6]'
   },
   {
      coverTitle: 'Research Notes',
      title: 'What we learned from our latest experiments',
      date: 'Oct 22, 2026',
      dateTime: '2026-10-22',
      color: 'bg-[#c86e47]'
   },
   {
      coverTitle: 'AI at Scale',
      title: 'Designing better tools for teams',
      date: 'Oct 14, 2026',
      dateTime: '2026-10-14',
      color: 'bg-[#2f76a6]'
   },
   {
      coverTitle: 'The Next Step',
      title: 'Exploring what comes after the prototype',
      date: 'Oct 5, 2026',
      dateTime: '2026-10-05',
      color: 'bg-[#b39539]'
   }
];

export default function Home() {
   return (
      <main className="min-h-screen bg-[#080808] flex flex-col mt-[-60] items-center justify-start text-[#f8f8f8]">
         <Image
            src="/openflightHPC_website_v2/logo.svg"
            alt="logo"
            width={500}
            height={500}
         ></Image>
         <div className="w-full mt-[-160] font-bold tracking-wide flex flex-col mx-80 text-lg justify-center w-full max-w-4xl mx-auto px-6 flex flex-col gap-6 text-center">
            <p>
               Welcome to the{' '}
               <em>
                  OpenFlight <span className="text-green-400/70">Labs</span>
               </em>
               , a curated collection of research and development experiments from the{' '}
               <Link
                  href="/"
                  className="text-green-300/70 underline transition hover:text-green-400"
               >
                  OpenFlightHPC group
               </Link>
               . Each project in our collection represents a unique exploration — an idea tested, a
               hypothesis pursued, a discovery made.
            </p>

            <p>
               <Link
                  href="/projects"
                  className="text-green-300/70 underline transition hover:text-green-400"
               >
                  Browse our projects
               </Link>{' '}
               to learn what worked, what didn&apos;t, and what we discovered along the way.
            </p>
         </div>

         <section aria-labelledby="recent-projects" className="mt-20 w-full pb-24">
            <h2 id="recent-projects" className="text-center text-4xl font-bold">
               Recent Projects
            </h2>
            <div className="mt-10">
               <Marquee speed={35} pauseOnHover autoFill>
                  {projects.map((project, index) => (
                     <article key={project.title} className="mx-3 w-64 shrink-0 sm:w-72">
                        <div
                           className={`relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl p-5 ${project.color}`}
                        >
                           <div
                              aria-hidden="true"
                              className="absolute -right-12 -top-14 h-48 w-48 rounded-full border-[28px] border-white/15"
                           />
                           <span className="relative text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                              OpenFlight Labs
                           </span>
                           <div className="relative">
                              <span className="mb-2 block text-sm text-white/70">
                                 {String(index + 1).padStart(2, '0')}
                              </span>
                              <span className="block max-w-[10ch] text-3xl font-semibold leading-tight text-white">
                                 {project.coverTitle}
                              </span>
                           </div>
                        </div>
                        <div className="pt-4">
                           <h3 className="min-h-[4.5rem] text-lg font-semibold leading-snug text-[#f8f8f8]">
                              {project.title}
                           </h3>
                           <time
                              dateTime={project.dateTime}
                              className="mt-2 block text-sm text-zinc-400"
                           >
                              {project.date}
                           </time>
                        </div>
                     </article>
                  ))}
               </Marquee>
            </div>
         </section>
      </main>
   );
}
