import Link from 'next/link';
import Marquee from 'react-fast-marquee';

import AnimatedLogo from '@/app/components/AnimatedLogo';
import CardWave from '@/app/components/CardWave';
import Footer from '@/app/components/Footer';
import { formatDate } from '@/lib/date-formatter';
import { getFeaturedProjects } from '@/lib/project-handler';

export default function Home() {
   const featuredProjects = getFeaturedProjects();

   return (
      <>
         <main className="flex-1 bg-black flex flex-col sm:mt-[-100] mt-[-60] items-center justify-start text-[#f8f8f8]">
            <AnimatedLogo />
            <div className="w-full sm:mt-[-160] mt-[-100] font-bold tracking-wide flex flex-col mx-80 text-lg justify-center w-full max-w-4xl mx-auto px-6 flex flex-col gap-6 text-center">
               <p>
                  <em>
                     OpenFlight <span className="text-green-400/70">Labs</span>{' '} 
                  </em>
                  provides
                  <span className="text-green-400/70"> community tools </span> 
                  and 
                  <span className="text-green-400/70"> open knowledge </span>
                  for the HPC industry.
                  
                  We explore, build, test and iterate on ideas to expand and grow the capabilities of academic, commercial and nonprofit HPC & AI environments.
                  Our work is majorly supported by <span className="text-green-400/70">Alces Flight</span>.
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

            <section aria-labelledby="community-presence" className="mt-20 w-full">
               <div className="mx-auto w-full max-w-4xl px-6">
                  <h2 id="community-presence" className="text-center text-4xl font-bold">
                     Present in the Community
                  </h2>

                  <div className="mt-10 grid gap-6 sm:grid-cols-3">
                     <div className="rounded-2xl bg-white/5 p-6 text-center">
                        <span className="block text-4xl font-bold text-green-400/70">400+</span>
                        <span className="mt-2 block text-sm font-semibold tracking-wide text-[#f8f8f8]">
                           students educated, trained &amp; challenged
                        </span>
                        <p className="mt-3 text-sm text-zinc-400">
                           Since 2020 through our cluster training roadshow, Student Cluster
                           Competition contributions and community workshops.
                        </p>
                     </div>

                     <div className="rounded-2xl bg-white/5 p-6 text-center">
                        <span className="block whitespace-nowrap text-3xl font-bold text-green-400/70">SC · ISC · CIUK</span>
                        <span className="mt-2 block text-sm font-semibold tracking-wide text-[#f8f8f8]">
                           live demos at the major HPC events
                        </span>
                        <p className="mt-3 text-sm text-zinc-400">
                           Performed live at Supercomputing, ISC and CIUK on booths including
                           Alces, AWS, Azure and Google Cloud.
                        </p>
                     </div>

                     <div className="rounded-2xl bg-white/5 p-6 text-center">
                        <span className="block text-4xl font-bold text-green-400/70">20+</span>
                        <span className="mt-2 block text-sm font-semibold tracking-wide text-[#f8f8f8]">
                           organisations running our work
                        </span>
                        <p className="mt-3 text-sm text-zinc-400">
                           From universities and healthcare to motorsport &amp; engineering.
                           Our research and projects have gone on to help them in production.
                        </p>
                     </div>
                  </div>

                  <p className="mt-8 text-center text-sm text-zinc-400">
                     Our work has supported{' '}
                     <span className="text-green-300/70">11+ academic institutions</span> (including{' '}
                     <span className="text-[#f8f8f8]">University of Liverpool, UCL, University of York, University of Stirling and City St George&apos;s</span>) alongside{' '}
                     <span className="text-green-300/70">4+ motorsport and engineering companies</span> (including{' '}
                     <span className="text-[#f8f8f8]">Formula 1</span>) and{' '}
                     <span className="text-green-300/70">5+ healthcare, virus and cancer research groups</span> — including{' '}
                     <span className="text-[#f8f8f8]">the NHS and CompBioMed</span>. See{' '}
                     <Link
                        href="/impact"
                        className="text-green-300/70 underline transition hover:text-green-400"
                     >
                        where our work has been used
                     </Link>.
                  </p>
               </div>
            </section>

            <section aria-labelledby="featured-projects" className="mt-20 pb-26 w-full ">
               <h2 id="featured-projects" className="text-center text-4xl font-bold">
                  Our Research Projects
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
