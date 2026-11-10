import Marquee from 'react-fast-marquee';
import Link from 'next/link';
import AnimatedLogo from './components/AnimatedLogo';
import { getFeaturedProjects } from '@/lib/projects-handler';

const projectBackgroundColors = [
   '#1b8a62',
   '#7d57b6',
   '#c86e47',
   '#2f76a6',
   '#b39539'
];

const formatDate = (date: string) => {
   const [day, month, year] = date.split('/').map(Number);

   return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
   });
};

export default function Home() {
   const featuredProjects = getFeaturedProjects();

   return (
      <main className="min-h-screen bg-[#080808] flex flex-col mt-[-60] items-center justify-start text-[#f8f8f8]">
         <AnimatedLogo />
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
                  {featuredProjects.map((project, index) => (
                     <article key={project.id} className="mx-3 w-64 shrink-0 sm:w-72">
                        <div
                           className="relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl p-5"
                           style={{
                              backgroundColor:
                                 projectBackgroundColors[index % projectBackgroundColors.length]
                           }}
                        >
                           {/* Decorative circle */}
                           <div
                              aria-hidden="true"
                              className="absolute -right-12 -top-14 h-48 w-48 rounded-full border-[28px] border-white/15"
                           />

                           <div className="relative flex items-center justify-between">
                              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                                 OpenFlight Labs
                              </span>

                              <span className="text-xs font-medium text-white/60">
                                 {String(index + 1).padStart(2, '0')}
                              </span>
                           </div>

                           <div className="relative">
                              <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/60">
                                 {project.status.replace('-', ' ')}
                              </span>

                              <span className="block max-w-[10ch] text-3xl font-semibold leading-tight text-white">
                                 {project.name}
                              </span>
                           </div>
                        </div>

                        <div className="pt-4">
                           <h3 className="min-h-[4.5rem] text-lg font-semibold leading-snug text-[#f8f8f8]">
                              {project.description}
                           </h3>

                           <div className="flex flex-wrap gap-2">
                              {project.languages.slice(0, 3).map((language) => (
                                 <span
                                    key={language}
                                    className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-zinc-300"
                                 >
                                    {language}
                                 </span>
                              ))}
                           </div>

                           <time
                              dateTime={project.startDate}
                              className="mt-3 block text-sm text-zinc-400"
                           >
                              {formatDate(project.startDate)}
                              {project.endDate &&
                                 project.endDate !== project.startDate &&
                                 ` — ${formatDate(project.endDate)}`}
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
