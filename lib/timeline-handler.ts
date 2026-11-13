import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

import { z } from 'zod';

import { dateValue } from './date';
import type { Project } from './project-handler';
import { getAllProjects } from './project-handler';

/** A simple markdown timeline entry from the timeline folder */
export type TimelineEntry = {
   colour: string;
   content: string;
   date: string;
   id: string;
   project: string | null;
   title: string;
};

/** One item on the timeline, either a registered project or a markdown entry */
export type TimelineItem =
   | ({ kind: 'entry'; timestamp: number } & TimelineEntry)
   | ({ kind: 'project'; timestamp: number } & Project);

const TimelineEntrySchema = z.object({
   colour: z
      .string()
      .trim()
      .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid hex colour')
      .default('#3f3f46'),
   date: z
      .string()
      .trim()
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Timeline entry dates must be in dd/mm/yyyy format'),
   project: z.string().trim().min(1).nullable().default(null),
   title: z.string().trim().min(1).max(80)
});

/** Files in the timeline folder that are documentation, not entries */
const IGNORED_FILES = new Set(['readme.md']);

/** Extracts the key/value metadata and the markdown body from an entry */
function parseFrontmatter(raw: string): { body: string; metadata: Record<string, string> } {
   const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(raw);

   if (!match) {
      throw new Error(
         'Timeline entry must start with a frontmatter block containing a title and date'
      );
   }

   const metadata = Object.fromEntries(
      match[1]
         .split(/\r?\n/)
         .filter((line) => line.trim() !== '')
         .map((line) => {
            const separator = line.indexOf(':');
            return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
         })
   );

   return { body: match[2].trim(), metadata };
}

/**
 * Gathers every timeline entry from the markdown files in the timeline folder
 * @returns The timeline entries from the folder
 */
export function getTimelineEntries(): TimelineEntry[] {
   const timelineDir = path.join(process.cwd(), 'public', 'timeline');

   if (!fs.existsSync(timelineDir)) {
      return [];
   }

   const files = fs
      .readdirSync(timelineDir)
      .filter((file) => file.endsWith('.md') && !IGNORED_FILES.has(file.toLowerCase()));

   return files.map((file) => {
      const raw = fs.readFileSync(path.join(timelineDir, file), 'utf8');
      const { body, metadata } = parseFrontmatter(raw);
      const entry = TimelineEntrySchema.parse(metadata);

      return {
         ...entry,
         content: body,
         id: file.replace(/\.md$/, '')
      };
   });
}

/**
 * Merges the registered projects and the markdown timeline entries into one
 * list ready for the timeline to render
 * @returns All the timeline items, most recent first
 */
export function getTimelineItems(): TimelineItem[] {
   const projects: TimelineItem[] = getAllProjects().map((project): TimelineItem => {
      return { ...project, kind: 'project', timestamp: dateValue(project.startDate) };
   });

   const entries: TimelineItem[] = getTimelineEntries().map((entry): TimelineItem => {
      return { ...entry, kind: 'entry', timestamp: dateValue(entry.date) };
   });

   return [...projects, ...entries].toSorted((a, b) => {
      const difference = b.timestamp - a.timestamp;

      if (difference !== 0) {
         return difference;
      }

      // On a tie keep projects in front of entries, both keeping their folder order
      if (a.kind !== b.kind) {
         return a.kind === 'project' ? -1 : 1;
      }

      return 0;
   });
}
