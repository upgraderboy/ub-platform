import { z } from 'zod';

export const ProjectCategorySchema = z.enum([
  'fullstack',
  'mobile',
  'frontend',
  'cloud',
  'ai',
  'opensource',
  'devops',
  'iot',
]);
export type ProjectCategory = z.infer<typeof ProjectCategorySchema>;

export const ProjectStatusSchema = z.enum([
  'shipped',
  'in_development',
  'winner',
  'concept',
]);
export type ProjectStatus = z.infer<typeof ProjectStatusSchema>;

export const CaseStudySchema = z.object({
  problem: z.string().min(10),
  solution: z.string().min(10),
  architectureDiagramUrl: z.string().url().optional(),
  keyFeatures: z.array(z.string().min(1)),
  challenges: z.string().optional(),
  results: z.string().optional(),
});
export type CaseStudy = z.infer<typeof CaseStudySchema>;

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  shortDescription: z.string().max(250),
  category: ProjectCategorySchema,
  status: ProjectStatusSchema.default('shipped'),
  tags: z.array(z.string()),
  coverImage: z.string().url(),
  demoUrl: z.string().url().nullable().optional(),
  githubUrl: z.string().url().nullable().optional(),
  buyUrl: z.string().url().nullable().optional(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  caseStudy: CaseStudySchema.optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Project = z.infer<typeof ProjectSchema>;
