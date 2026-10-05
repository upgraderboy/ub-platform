import { z } from 'zod';

export type ResourceCategory = {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  children?: ResourceCategory[];
};

export const ResourceCategorySchema: z.ZodType<ResourceCategory> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string().min(1),
    slug: z.string().min(1),
    parentId: z.string().nullable().optional(),
    children: z.array(ResourceCategorySchema).optional(),
  })
);

export const ResourceDocumentSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  description: z.string(),
  pdfUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  source: z.string().default('Upgrader Boy'),
  fileSizeBytes: z.number().optional(),
  categoryPath: z.array(z.string()), // e.g. ['cat-btech', 'cat-btech-cs', 'cat-btech-cs-notes-dsa']
  tags: z.array(z.string()),
  publishedAt: z.string(),
});
export type ResourceDocument = z.infer<typeof ResourceDocumentSchema>;
