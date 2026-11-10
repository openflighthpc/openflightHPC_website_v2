import 'server-only';

import path from 'node:path';
import fs from 'node:fs';

/**
 * The layout of the project meta.json file
 */
export type Project = {
   id: string;
   name: string;
   description: string;
   languages: string[];
   tags: string[];
   status: 'in-progress' | 'complete' | 'archived';
   featured: boolean;
   logoPath: string | null;
   startDate: string;
   endDate: string | null;
};

/**
 * Gathers all the projects from the projects directory and returns them
 * @returns All the projects from the projects directory
 */
export function getAllProjects(): Project[] {
   const projectsDir = path.join(process.cwd(), 'public', 'projects');

   const folders = fs
      .readdirSync(projectsDir)
      .filter((item) => fs.statSync(path.join(projectsDir, item)).isDirectory());

   const projects: Project[] = [];

   for (const folder of folders) {
      const projectDir = path.join(projectsDir, folder);
      const metaPath = path.join(projectDir, 'meta.json');

      if (!fs.existsSync(metaPath) || !fs.statSync(metaPath).isFile()) {
         continue;
      }

      projects.push({
         id: folder,
         ...JSON.parse(fs.readFileSync(metaPath, 'utf8')),
         logoPath: fs.existsSync(path.join(projectDir, 'logo.png'))
            ? path.join('projects', folder, 'logo.png')
            : null
      });
   }

   return projects;
}

/**
 * Get's the information about a specific project
 * @param id The projects ID
 * @returns The meta data about the project
 */
export function getProject(id: string): Project & { summary: string; breakdown: string } {
   const projectDir = path.join(process.cwd(), 'public', 'projects', id);

   if (!fs.existsSync(projectDir) || !fs.existsSync(path.join(projectDir, 'meta.json'))) {
      throw new Error(`Cannot find a project called ${id}`);
   }

   return {
      id,
      ...JSON.parse(fs.readFileSync(path.join(projectDir, 'meta.json'), 'utf8')),
      summary: fs.readFileSync(path.join(projectDir, 'summary.md'), 'utf8').trim(),
      breakdown: fs.readFileSync(path.join(projectDir, 'breakdown.md'), 'utf8').trim(),
      logoPath: fs.existsSync(path.join(projectDir, 'logo.png'))
         ? path.join('projects', id, 'logo.png')
         : null
   };
}

/**
 * Gets the featured projects from the projects dir
 * @returns The featured projects
 */
export function getFeaturedProjects(): Project[] {
   return getAllProjects().filter((project) => project.featured);
}
