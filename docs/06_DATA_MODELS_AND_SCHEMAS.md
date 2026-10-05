# 06: Data Models & Zod Schemas Specification

This document defines the strict data models and Zod schemas shared across Web, Admin, and Mobile via `packages/types`.

---

## 1. Project & Case Study Schema

```typescript
import { z } from 'zod';

export const ProjectSchema = z.object({
  id: z.string().uuid().or(z.string()),
  title: z.string().min(3),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  shortDescription: z.string().max(250),
  category: z.enum(['fullstack', 'mobile', 'frontend', 'cloud', 'ai']),
  tags: z.array(z.string()),
  coverImage: z.string().url(),
  demoUrl: z.string().url().nullable().optional(),
  githubUrl: z.string().url().nullable().optional(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
  
  // Case Study Content
  caseStudy: z.object({
    problem: z.string(),
    solution: z.string(),
    architectureDiagramUrl: z.string().url().optional(),
    keyFeatures: z.array(z.string()),
    challenges: z.string().optional(),
    results: z.string().optional(),
  }).optional(),
  
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Project = z.infer<typeof ProjectSchema>;
```

---

## 2. Blog Post Schema

```typescript
export const BlogSchema = z.object({
  id: z.string().uuid().or(z.string()),
  title: z.string().min(5),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(300),
  content: z.string(), // Markdown or rich block JSON
  coverImage: z.string().url(),
  tags: z.array(z.string()),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  readingTimeMinutes: z.number().min(1),
  publishedAt: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Blog = z.infer<typeof BlogSchema>;
```

---

## 3. Resource & Category Tree Schema

```typescript
export const ResourceCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  parentId: z.string().nullable().default(null),
  children: z.lazy(() => z.array(ResourceCategorySchema)).default([]),
});

export const ResourceDocumentSchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  description: z.string(),
  pdfUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional(),
  source: z.string().default('Upgrader Boy'),
  fileSizeBytes: z.number().optional(),
  categoryPath: z.array(z.string()), // ['cat-btech', 'cat-cs', 'cat-dsa']
  tags: z.array(z.string()),
  publishedAt: z.string(),
});

export type ResourceCategory = z.infer<typeof ResourceCategorySchema>;
export type ResourceDocument = z.infer<typeof ResourceDocumentSchema>;
```

---

## 4. Milestone Memory Schema

```typescript
export const MemorySchema = z.object({
  id: z.string(),
  title: z.string().min(3),
  description: z.string(),
  category: z.enum(['hackathons', 'meetups', 'internships', 'college', 'work', 'milestones']),
  date: z.string(), // e.g. "March 2024"
  images: z.array(z.string().url()),
  featured: z.boolean().default(false),
});

export type Memory = z.infer<typeof MemorySchema>;
```

---

## 5. Client Lead & Project Estimator Schema

```typescript
export const LeadSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2),
  email: z.string().email(),
  whatsapp: z.string().optional(),
  projectType: z.enum(['web', 'mobile', 'fullstack', 'custom_api', 'consulting']),
  budgetRange: z.enum(['< $1k', '$1k - $3k', '$3k - $5k', '$5k+']),
  timeline: z.enum(['urgent', '1-2 months', 'flexible']),
  description: z.string().min(10),
  status: z.enum(['new', 'contacted', 'in_progress', 'closed']).default('new'),
  createdAt: z.string().datetime(),
});

export type Lead = z.infer<typeof LeadSchema>;
```

---

## 6. Terminal Console Command Schema

```typescript
export const TerminalCommandSchema = z.object({
  command: z.string().min(1),
  description: z.string(),
  output: z.string(),
  aliases: z.array(z.string()).default([]),
});

export type TerminalCommand = z.infer<typeof TerminalCommandSchema>;
```
