import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

import ProjectMetadata from '@/public/projects/metadata.registry';

import type { DetailedProject, Project } from './metadata-handler';

export type { DetailedProject, Project } from './metadata-handler';

/**
 * Gathers all the projects from the projects directory and returns them
 * @returns All the projects from the projects directory
 */
export function getAllProjects(): Project[] {
   const projectsDir = path.join(process.cwd(), 'public', 'projects');

   const projects = Object.entries(ProjectMetadata).map(([id, metadata]) => {
      const projectDir = path.join(projectsDir, id);

      // Get logo if there is one
      const logoPath = fs.existsSync(path.join(projectDir, 'logo.webp'))
         ? path.join('projects', id, 'logo.webp')
         : null;

      return {
         id,
         ...metadata,
         logoPath
      } as Project;
   });

   return projects.filter((project) => project !== null);
}

/**
 * Get's the information about a specific project
 * @param id The projects ID
 * @returns The meta data about the project
 */
export function getProject(id: string): DetailedProject {
   const projectDir = path.join(process.cwd(), 'public', 'projects', id);

   // Get the metadata
   if (!Object.hasOwn(ProjectMetadata, id)) {
      throw new Error(`No metadata can be found for ${id}`);
   }
   const metadata = ProjectMetadata[id as keyof typeof ProjectMetadata];

   // Get the summary data
   const summaryPath = path.join(projectDir, 'summary.md');
   if (!fs.existsSync(summaryPath)) {
      throw new Error(`No summary.md file can be found for ${id}`);
   }
   const summaryData = fs.readFileSync(summaryPath, 'utf8').trim();

   // Get the breakdown data
   const breakdownPath = path.join(projectDir, 'breakdown.md');
   let breakdownData: string = '';
   if (!fs.existsSync(breakdownPath)) {
      const breakdownDir = path.join(projectDir, 'breakdown');
      if (!fs.existsSync(breakdownDir) && !fs.statSync(breakdownDir).isDirectory()) {
         throw new Error(`No breakdown.md file can be found for ${id}`);
      }

      const files = fs
         .readdirSync(breakdownDir)
         .filter((value) => value.endsWith('.md'))
         .filter((item) => !fs.statSync(path.join(breakdownDir, item)).isDirectory());

      for (const file of files) {
         if (breakdownData) {
            breakdownData += `\n\n`;
         }
         breakdownData += fs.readFileSync(path.join(breakdownDir, file), 'utf8').trim();
      }
   } else {
      breakdownData = fs.readFileSync(breakdownPath, 'utf8').trim();
   }

   // Get logo if their is one
   const logoPath = fs.existsSync(path.join(projectDir, 'logo.webp'))
      ? path.join('projects', id, 'logo.webp')
      : null;

   return {
      id,
      ...metadata,
      breakdown: breakdownData,
      logoPath,
      summary: summaryData
   } as DetailedProject;
}

/**
 * Gets the featured projects from the projects dir
 * @returns The featured projects
 */
export function getFeaturedProjects(): Project[] {
   return getAllProjects().filter((project) => project.featured);
}
