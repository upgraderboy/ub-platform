import { z } from 'zod';

export const MemoryCategorySchema = z.enum([
  'hackathons',
  'meetups',
  'internships',
  'college',
  'work',
  'milestones',
  'community',
  'labs',
]);
export type MemoryCategory = z.infer<typeof MemoryCategorySchema>;

export const BehindTheScenesSchema = z.object({
  theCrisis: z.string().optional(),
  theBreakthrough: z.string().optional(),
  techStack: z.array(z.string()).optional(),
});
export type BehindTheScenes = z.infer<typeof BehindTheScenesSchema>;

export const TeamMemberSchema = z.object({
  name: z.string(),
  role: z.string(),
});
export type TeamMember = z.infer<typeof TeamMemberSchema>;

export const MemoryMoodSchema = z.enum([
  'grit',
  'triumph',
  'nostalgia',
  'visionary',
]);
export type MemoryMood = z.infer<typeof MemoryMoodSchema>;

export const MemorySchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  description: z.string(),
  // Multi-category array allows cross-category representation (e.g. SIH in both hackathon and college)
  categories: z.array(MemoryCategorySchema).min(1).optional(),
  // Backward compatible single category
  category: MemoryCategorySchema.optional(),
  // Mood / emotional energy tags for visitor mood-based discovery
  mood: MemoryMoodSchema.optional(),
  moods: z.array(MemoryMoodSchema).optional(),
  date: z.string(),
  year: z.string().optional(),
  location: z.string().optional(),
  coverImage: z.string().url().optional(),
  images: z.array(z.string().url()).min(1),
  gallery: z.array(z.string().url()).optional(),
  badge: z.string().optional(),
  featured: z.boolean().default(false),
  behindTheScenes: BehindTheScenesSchema.optional(),
  teamMembers: z.array(TeamMemberSchema).optional(),
});
export type Memory = z.infer<typeof MemorySchema>;

