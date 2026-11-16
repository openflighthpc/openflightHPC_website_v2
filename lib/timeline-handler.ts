import 'server-only';

import { dateValue } from './date-formatter';
import type { Project } from './project-handler';
import { getAllProjects } from './project-handler';

/**
 * Merges the registered projects and the markdown timeline entries into one
 * list ready for the timeline to render
 * @returns All the timeline items, most recent first
 */
export function getTimelineItems(): Project[] {
   return getAllProjects()
      .map((project) => {
         return { ...project, timestamp: dateValue(project.startDate) };
      })
      .toSorted((a, b) => {
         const difference = b.timestamp - a.timestamp;

         if (difference !== 0) {
            return difference;
         }

         return 0;
      });
}
