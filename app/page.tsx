import Link from 'next/link';
import Marquee from 'react-fast-marquee';

import AnimatedLogo from '@/app/components/AnimatedLogo';
import Footer from '@/app/components/Footer';
import { getFeaturedProjects } from '@/lib/project-handler';

function CardWave() {
   return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
         <svg className="h-full w-full" viewBox="0 0 288 216" preserveAspectRatio="none">
            <path
               d="M-156 108 C-117 175 -39 192 0 108 C39 24 117 24 156 108 S250 175 312 106 S429 24 468 108"
               fill="none"
               stroke="rgba(255, 255, 255, 0.15)"
               strokeWidth="28"
               transform="translate(-8 12)"
            />
         </svg>
      </div>
   );
}

const formatDate = (date: string) => {
   const [day, month, year] = date.split('/').map(Number);

   return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
      year: 'numeric'
   });
};

export default function Home() {
   const featuredProjects = getFeaturedProjects();

   return (
      <>
         <main className="flex-1 bg-black flex flex-col sm:mt-[-100] mt-[-60] items-center justify-start text-[#f8f8f8]">
            <AnimatedLogo />
            <div className="w-full sm:mt-[-160] mt-[-100] font-bold tracking-wide flex flex-col mx-80 text-lg justify-center w-full max-w-4xl mx-auto px-6 flex flex-col gap-6 text-center">
               <p>
                  Welcome to the{' '}
                  <em>
                     OpenFlight <span className="text-green-400/70">Labs</span>
                  </em>
                  , a curated collection of research and development experiments from the{' '}
                  <a
                     href="https://openflighthpc.github.io/docs.openflighthpc.org/latest/"
                     className="text-green-300/70 underline transition hover:text-green-400"
                     target="_blank"
                  >
                     OpenFlightHPC group
                  </a>
                  . Each project in our collection represents a unique exploration — an idea tested,
                  a hypothesis pursued, a discovery made.
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

            <section aria-labelledby="featured-projects" className="mt-20 pb-26 w-full ">
               <h2 id="featured-projects" className="text-center text-4xl font-bold">
                  Featured Projects
               </h2>

               <div className="mt-10  hidden sm:block ">
                  <Marquee speed={15} pauseOnHover autoFill className="[&_.rfm-child]:self-start">
                     {featuredProjects.map((project, index) => (
                        <article
                           key={project.id}
                           className="mx-3 min-h-[26rem] w-64 shrink-0 sm:w-72"
                        >
                           <Link key={project.id} href={`/projects/${project.id}`}>
                              <div
                                 style={{
                                    backgroundColor: project.colour
                                 }}
                                 className="relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl p-5"
                              >
                                 <CardWave />

                                 {/* Content */}
                                 <div className="relative z-10 flex items-center justify-between">
                                    <span className="text-xs font-medium uppercase tracking-widest">
                                       {project.status.replace('-', ' ')}
                                    </span>
                                    <span className="text-xs font-medium">
                                       {String(index + 1).padStart(2, '0')}
                                    </span>
                                 </div>

                                 <div className="relative z-10">
                                    <span className="block text-3xl font-semibold leading-tight text-white">
                                       {project.name}
                                    </span>
                                 </div>
                              </div>
                           </Link>

                           <div className="pt-4">
                              <h3 className="mb-3 text-lg font-semibold leading-snug text-[#f8f8f8]">
                                 {project.description}
                              </h3>

                              <div className="flex flex-wrap gap-2">
                                 {project.languages.map((language) => (
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
                                 {project.status === 'in-progress'
                                    ? ' - In Progress'
                                    : project.endDate && project.endDate !== project.startDate
                                      ? ` - ${formatDate(project.endDate)}`
                                      : ''}
                              </time>
                           </div>
                        </article>
                     ))}
                  </Marquee>
               </div>

               <div className="mt-10 flex w-full flex-col items-center gap-10 px-4 sm:hidden">
                  {featuredProjects.map((project, index) => (
                     <article key={project.id} className="w-full max-w-sm">
                        <Link key={project.id} href={`/projects/${project.id}`}>
                           <div
                              style={{
                                 backgroundColor: project.colour
                              }}
                              className="relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-2xl p-5"
                           >
                              <CardWave />

                              {/* Content */}
                              <div className="relative z-10 flex items-center justify-between">
                                 <span className="text-xs font-medium uppercase tracking-widest">
                                    {project.status.replace('-', ' ')}
                                 </span>
                                 <span className="text-xs font-medium">
                                    {String(index + 1).padStart(2, '0')}
                                 </span>
                              </div>

                              <div className="relative z-10">
                                 <span className="block text-3xl font-semibold leading-tight text-white">
                                    {project.name}
                                 </span>
                              </div>
                           </div>
                        </Link>

                        <div className="pt-4">
                           <h3 className="mb-3 text-lg font-semibold leading-snug text-[#f8f8f8]">
                              {project.description}
                           </h3>

                           <div className="flex flex-wrap gap-2">
                              {project.languages.map((language) => (
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
                              {project.status === 'in-progress'
                                 ? ' - In Progress'
                                 : project.endDate && project.endDate !== project.startDate
                                   ? ` - ${formatDate(project.endDate)}`
                                   : ''}
                           </time>
                        </div>
                     </article>
                  ))}
               </div>
            </section>
         </main>
         <Footer />
      </>
   );
}
