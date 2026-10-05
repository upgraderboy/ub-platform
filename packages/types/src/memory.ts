import { z } from 'zod';

export const MemoryCategorySchema = z.enum([
  'hackathons',
  'meetups',
  'internships',
  'college',
  'work',
  'milestones',
]);
export type MemoryCategory = z.infer<typeof MemoryCategorySchema>;

export const MemorySchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  description: z.string(),
  category: MemoryCategorySchema,
  date: z.string(),
  images: z.array(z.string().url()).min(1),
  featured: z.boolean().default(false),
});
export type Memory = z.infer<typeof MemorySchema>;
