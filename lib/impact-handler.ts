import 'server-only';

import fs from 'node:fs';
import path from 'node:path';

const impactDir = path.join(process.cwd(), 'public', 'impact');

export type ImpactStory = {
   id: string;
   org: string;
   title: string;
   body: string[];
   project: {
      href: string;
      name: string;
   } | null;
   reference: {
      href: string;
      label: string;
   } | null;
};

function parseMarkdownLink(line: string): { href: string; label: string } | null {
   const match = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
   if (!match) {
      return null;
   }
   return { href: match[2], label: match[1] };
}

/**
 * Parses a story.md file: `# Org` heading, `## Title` heading, body
 * paragraphs and optional `Deployed by:` / `Reference:` link lines.
 */
function parseStory(id: string, raw: string): ImpactStory {
   const lines = raw.trim().split('\n').map((line) => line.trim()).filter(Boolean);

   const org = (lines[0]?.match(/^#\s+(.+)$/) ?? [])[1] ?? '';
   const title = (lines[1]?.match(/^##\s+(.+)$/) ?? [])[1] ?? '';

   const body: string[] = [];
   let project: ImpactStory['project'] = null;
   let reference: ImpactStory['reference'] = null;

   for (const line of lines.slice(2)) {
      if (line.startsWith('Deployed by:')) {
         const link = parseMarkdownLink(line);
         if (link) {
            project = { href: link.href, name: link.label };
         }
      } else if (line.startsWith('Reference:')) {
         reference = parseMarkdownLink(line);
      } else if (!line.startsWith('#')) {
         body.push(line);
      }
   }

   return { body, id, org, project, reference, title };
}

/**
 * Gathers all the impact stories from the impact directory
 * @returns All the impact stories
 */
export function getAllImpactStories(): ImpactStory[] {
   const storyIds = fs
      .readdirSync(impactDir)
      .filter((entry) => fs.statSync(path.join(impactDir, entry)).isDirectory());

   return storyIds.map((id) =>
      parseStory(id, fs.readFileSync(path.join(impactDir, id, 'story.md'), 'utf8'))
   );
}
