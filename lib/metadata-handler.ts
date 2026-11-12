import { z } from 'zod';

const ProjectMetadataSchema = z.object({
   colour: z
      .string()
      .trim()
      .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid hex colour')
      .default('#2f76a6'),
   description: z.string().trim().min(1),
   endDate: z.string().trim().min(1).nullable().default(null),
   featured: z.boolean().default(false),
   languages: z.array(z.string().trim().min(1)).default([]),
   name: z.string().trim().min(1),
   startDate: z.string().trim().min(1),
   status: z.enum(['in-progress', 'complete', 'archived']),
   tags: z.array(z.string().trim().min(1)).default([])
});

type ProjectMetadataInput = z.input<typeof ProjectMetadataSchema>;
type ProjectMetadata = z.output<typeof ProjectMetadataSchema>;

export type Project = ProjectMetadata & {
   id: string;
   logoPath: string | null;
};

export type DetailedProject = Project & {
   summary: string;
   breakdown: string;
};

/**
 * Creates the metadata for the project
 * @param metadata The data to set in the metadata
 * @returns The validated metadata
 */
export function defineProjectMetadata(metadata: ProjectMetadataInput): ProjectMetadata {
   return ProjectMetadataSchema.parse(metadata);
}
