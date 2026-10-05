import { z } from 'zod';

export const ProjectTypeSchema = z.enum([
  'web',
  'mobile',
  'fullstack',
  'custom_api',
  'consulting',
]);
export type ProjectType = z.infer<typeof ProjectTypeSchema>;

export const BudgetRangeSchema = z.enum([
  '< $1k',
  '$1k - $3k',
  '$3k - $5k',
  '$5k+',
]);
export type BudgetRange = z.infer<typeof BudgetRangeSchema>;

export const ProjectTimelineSchema = z.enum([
  'urgent',
  '1-2 months',
  'flexible',
]);
export type ProjectTimeline = z.infer<typeof ProjectTimelineSchema>;

export const LeadStatusSchema = z.enum([
  'new',
  'contacted',
  'in_progress',
  'closed',
]);
export type LeadStatus = z.infer<typeof LeadStatusSchema>;

export const LeadSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  email: z.string().email(),
  whatsapp: z.string().optional(),
  projectType: ProjectTypeSchema,
  budgetRange: BudgetRangeSchema,
  timeline: ProjectTimelineSchema,
  description: z.string().min(10),
  status: LeadStatusSchema.default('new'),
  createdAt: z.string(),
});
export type Lead = z.infer<typeof LeadSchema>;
