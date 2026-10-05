import { z } from 'zod';

export const BlogStatusSchema = z.enum(['draft', 'published', 'archived']);
export type BlogStatus = z.infer<typeof BlogStatusSchema>;

export const BlogSchema = z.object({
  id: z.string(),
  title: z.string().min(5),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(300),
  content: z.string().min(10), // Markdown or structured content
  coverImage: z.string().url(),
  tags: z.array(z.string()),
  status: BlogStatusSchema.default('draft'),
  readingTimeMinutes: z.number().min(1),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Blog = z.infer<typeof BlogSchema>;
