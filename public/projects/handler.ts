import path from "node:path";
import fs from 'node:fs'

/**
 * The layout of the project meta.json file
 */
export type Project = {
   name: string;
   description: string;
   languages: string[];
   tags: string[];
   status: 'active' | 'complete' | 'archived';
   featured: boolean;
   logoPath: string | null;
}

/**
 * Gathers all the projects from the projects directory and returns them
 * @returns All the projects from the projects directory
 */
export function getAllProjects(): Project[] {
   const projectsDir = path.join(process.cwd(), 'public', "projects");

   const folders = fs.readdirSync(projectsDir).filter((item) =>
      fs.statSync(path.join(projectsDir, item)).isDirectory()
   );

   const projects: Project[] = [];

   for (const folder of folders) {
      const projectDir = path.join(projectsDir, folder)
      const metaPath = path.join(projectDir, "meta.json");

      if (!fs.existsSync(metaPath) || !fs.statSync(metaPath).isFile()) {
         continue;
      }

      projects.push({
         ...JSON.parse(fs.readFileSync(metaPath, "utf8")),
         logoPath: (fs.existsSync(path.join(projectDir, 'logo.png'))) ? path.join(projectDir, 'logo.png') : null
      });
   }

   return projects;
}

/**
 * Get's the information about a specific project
 * @param name The name of the project to get
 * @returns The meta data about the project
 */
export function getProject(name: string): Project & { page: string } {
   const projectDir = path.join(process.cwd(), 'public', 'projects', name);

   if (!fs.existsSync(projectDir) || !fs.existsSync(path.join(projectDir, 'meta.json'))) {
      throw new Error(`Cannot find a project called ${name}`);
   }

   const data = JSON.parse(fs.readFileSync(path.join(projectDir, 'meta.json'), 'utf8'))

   return {
      ...data,
      page: fs.readFileSync(path.join(projectDir, 'page.md'), 'utf8'),
      logoPath: (fs.existsSync(path.join(projectDir, 'logo.png'))) ? path.join(projectDir, 'logo.png') : null
   };
}