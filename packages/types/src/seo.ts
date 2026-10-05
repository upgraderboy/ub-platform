import { z } from 'zod';

export const RouteSeoSchema = z.object({
  id: z.string(),
  path: z.string(),
  title: z.string(),
  description: z.string(),
  changefreq: z.enum(['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never']).default('weekly'),
  priority: z.number().min(0).max(1).default(0.7),
});
export type RouteSeo = z.infer<typeof RouteSeoSchema>;

export const SiteSeoSchema = z.object({
  siteTitle: z.string(),
  siteDescription: z.string(),
  faviconUrl: z.string().optional(),
  routes: z.array(RouteSeoSchema),
});
export type SiteSeo = z.infer<typeof SiteSeoSchema>;
