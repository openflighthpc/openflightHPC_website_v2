import { z } from 'zod';

/**
 *
 */
export const ProjectMetadataSchema = z.object({
   name: z.string().trim().min(1),
   colour: z
      .string()
      .trim()
      .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid hex colour')
      .default('#2f76a6'),
   description: z.string().trim().min(1),
   languages: z.array(z.string().trim().min(1)).default([]),
   tags: z.array(z.string().trim().min(1)).default([]),
   status: z.enum(['in-progress', 'complete', 'archived']),
   featured: z.boolean().default(false),
   startDate: z.string().trim().min(1),
   endDate: z.string().trim().min(1).nullable().default(null)
});

/**
 *
 */
export type ProjectMetadataInput = z.input<typeof ProjectMetadataSchema>;
export type ProjectMetadata = z.output<typeof ProjectMetadataSchema>;

/**
 *
 */
export type Project = ProjectMetadata & {
   id: string;
   logoPath: string | null;
};

/**
 *
 */
export type DetailedProject = Project & {
   summary: string;
   breakdown: string;
};
/**
 *
 * @param metadata
 * @returns
 */
export function defineProjectMetadata(metadata: ProjectMetadataInput): ProjectMetadata {
   return ProjectMetadataSchema.parse(metadata);
}
