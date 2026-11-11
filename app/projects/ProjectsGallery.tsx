'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ChevronDown, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Project } from '@/lib/project-handler';
import { RxFilter } from 'react-icons/rx';

const projectGradients = [
   'linear-gradient(135deg, #166534 0%, #0f766e 55%, #164e63 100%)',
   'linear-gradient(45deg, #6d28d9 0%, #9333ea 50%, #be185d 100%)',
   'linear-gradient(225deg, #c2410c 0%, #ea580c 55%, #b45309 100%)',
   'linear-gradient(315deg, #1d4ed8 0%, #2563eb 50%, #0e7490 100%)',
   'linear-gradient(90deg, #a16207 0%, #ca8a04 50%, #b45309 100%)',
   'linear-gradient(270deg, #0f766e 0%, #059669 50%, #3f6212 100%)',
   'linear-gradient(160deg, #be185d 0%, #db2777 50%, #7e22ce 100%)',
   'linear-gradient(20deg, #0e7490 0%, #0891b2 50%, #1d4ed8 100%)',
   'linear-gradient(200deg, #9a3412 0%, #c2410c 50%, #be123c 100%)',
   'linear-gradient(340deg, #4f46e5 0%, #7c3aed 50%, #a21caf 100%)'
];

type StatusFilter = 'all' | Project['status'];
type SortOrder = 'newest' | 'oldest';

const statusOptions: { label: string; value: StatusFilter }[] = [
   { label: 'All', value: 'all' },
   { label: 'In Progress', value: 'in-progress' },
   { label: 'Completed', value: 'complete' },
   { label: 'Archived', value: 'archived' }
];

const sortOptions: { label: string; value: SortOrder }[] = [
   { label: 'Newest to oldest', value: 'newest' },
   { label: 'Oldest to newest', value: 'oldest' }
];

const dateValue = (date: string) => {
   const [day, month, year] = date.split('/').map(Number);
   return Date.UTC(year, month - 1, day);
};

const formatDate = (date: string) => {
   const [day, month, year] = date.split('/').map(Number);

   return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
   });
};

export default function ProjectsGallery({ projects }: { projects: Project[] }) {
   const [selectedCategory, setSelectedCategory] = useState('All');
   const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('all');
   const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
   const [openMenu, setOpenMenu] = useState<'filter' | 'sort' | null>(null);
   const controlsRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      if (openMenu === null) return;

      const closeOnOutsideClick = (event: PointerEvent) => {
         if (!controlsRef.current?.contains(event.target as Node)) setOpenMenu(null);
      };
      const closeOnEscape = (event: KeyboardEvent) => {
         if (event.key === 'Escape') setOpenMenu(null);
      };

      document.addEventListener('pointerdown', closeOnOutsideClick);
      document.addEventListener('keydown', closeOnEscape);
      return () => {
         document.removeEventListener('pointerdown', closeOnOutsideClick);
         document.removeEventListener('keydown', closeOnEscape);
      };
   }, [openMenu]);

   const categories = ['All', ...new Set(projects.flatMap((project) => project.tags))];
   const visibleProjects = projects
      .map((project, index) => ({ project, index }))
      .filter(
         ({ project }) =>
            (selectedCategory === 'All' || project.tags.includes(selectedCategory)) &&
            (selectedStatus === 'all' || project.status === selectedStatus)
      )
      .sort((a, b) => {
         const difference = dateValue(a.project.startDate) - dateValue(b.project.startDate);
         return sortOrder === 'newest' ? -difference : difference;
      });

   return (
      <>
         <h1 className="md:text-5xl sm:text-4xl text-3xl font-bold mb-3 mt-14">
            {selectedCategory} Projects
         </h1>
         <div className="flex flex-wrap justify-between items-center gap-4">
            <div
               className="flex flex-wrap gap-2 text-lg"
               role="group"
               aria-label="Project categories"
            >
               {categories.map((category) => (
                  <button
                     key={category}
                     type="button"
                     aria-pressed={selectedCategory === category}
                     onClick={() => setSelectedCategory(category)}
                     className={`rounded-full border px-4 py-1.5 cursor-pointer text-sm transition ${
                        selectedCategory === category
                           ? 'border-green-400/60 bg-green-400/20 text-green-300'
                           : 'border-slate-300/10 bg-slate-600/40 text-slate-200 hover:border-green-400/50'
                     }`}
                  >
                     {category}
                  </button>
               ))}
            </div>
            <div
               ref={controlsRef}
               className="flex items-center text-lg tracking-wide font-bold gap-5"
            >
               <div className="relative">
                  <button
                     type="button"
                     aria-expanded={openMenu === 'filter'}
                     aria-controls="project-status-options"
                     onClick={() => setOpenMenu(openMenu === 'filter' ? null : 'filter')}
                     className="flex cursor-pointer items-center gap-1 hover:text-green-400"
                  >
                     {selectedStatus === 'all'
                        ? 'Filter'
                        : statusOptions.find((status) => status.value === selectedStatus)?.label}

                     {openMenu === 'filter' ? <X size={20} /> : <RxFilter aria-hidden="true" />}
                  </button>
                  {openMenu === 'filter' && (
                     <div
                        id="project-status-options"
                        role="group"
                        aria-label="Filter by project status"
                        className="absolute right-0 top-full z-20 mt-2 w-44 rounded-xl  bg-zinc-900 p-1 shadow-xl"
                     >
                        {statusOptions.map((option) => (
                           <button
                              key={option.value}
                              type="button"
                              aria-pressed={selectedStatus === option.value}
                              onClick={() => {
                                 setSelectedStatus(option.value);
                                 setOpenMenu(null);
                              }}
                              className={`block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium tracking-normal hover:bg-white/10 ${
                                 selectedStatus === option.value ? 'text-green-400' : 'text-white'
                              }`}
                           >
                              {option.label}
                           </button>
                        ))}
                     </div>
                  )}
               </div>

               <div className="relative">
                  <button
                     type="button"
                     aria-expanded={openMenu === 'sort'}
                     aria-controls="project-sort-options"
                     onClick={() => setOpenMenu(openMenu === 'sort' ? null : 'sort')}
                     className="flex group cursor-pointer items-center gap-1 hover:text-green-400"
                  >
                     Sort
                     <ChevronDown
                        aria-hidden="true"
                        className={` transition-transform duration-400 ${openMenu === 'sort' ? 'rotate-180' : ''}`}
                     />
                  </button>
                  {openMenu === 'sort' && (
                     <div
                        id="project-sort-options"
                        role="group"
                        aria-label="Sort projects"
                        className="absolute right-0 top-full z-20 mt-2 w-48 rounded-xl font-bold bg-zinc-900 p-1 shadow-xl"
                     >
                        {sortOptions.map((option) => (
                           <button
                              key={option.value}
                              type="button"
                              aria-pressed={sortOrder === option.value}
                              onClick={() => {
                                 setSortOrder(option.value);
                                 setOpenMenu(null);
                              }}
                              className={`block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium tracking-normal hover:bg-white/10 ${
                                 sortOrder === option.value ? 'text-green-400' : 'text-white'
                              }`}
                           >
                              {option.label}
                           </button>
                        ))}
                     </div>
                  )}
               </div>
            </div>
         </div>

         <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-3">
            {visibleProjects.length === 0 && (
               <p className="col-span-full mt-10 text-zinc-400">No projects match these filters.</p>
            )}
            {visibleProjects.map(({ project, index }) => (
               <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="group rounded-xl mt-10 hover:shadow-lg overflow-hidden transition"
               >
                  {project.logoPath ? (
                     <div className="relative w-full aspect-square overflow-hidden rounded-lg mb-4">
                        <Image
                           src={`/openflightHPC_website_v2/${project.logoPath}`}
                           alt={`${project.name} logo`}
                           fill
                           className="object-cover scale-100 transition-transform duration-400 hover:scale-110"
                        />
                     </div>
                  ) : (
                     <div
                        className="relative w-full duration-400 transition hover:brightness-80 aspect-square overflow-hidden rounded-lg mb-4"
                        style={{
                           backgroundImage: projectGradients[index % projectGradients.length]
                        }}
                     />
                  )}

                  <h2 className="text-xl font-bold mb-2">{project.description}</h2>

                  <div className="flex flex-wrap gap-2 mb-4">
                     {project.tags.map((tag) => (
                        <span
                           key={tag}
                           className="xtext-xs text-slate-200 border border-slate-300/10 rounded-full bg-slate-600/40 px-3 py-1"
                        >
                           {tag}
                        </span>
                     ))}
                  </div>
                  <div className="flex flex-col">
                     <span className="font-light">
                        {formatDate(project.startDate)}
                        {project.status === 'in-progress'
                           ? ' - In Progress'
                           : project.endDate && project.endDate !== project.startDate
                             ? ` - ${formatDate(project.endDate)}`
                             : ''}
                     </span>

                     <span className="flex items-center transition duration-400 group-hover:translate-x-2 group-hover:text-green-400 text-sm mt-2 font-bold">
                        View project <ChevronRight />{' '}
                     </span>
                  </div>
               </Link>
            ))}
         </div>
      </>
   );
}
