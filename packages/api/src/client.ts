import type {
  Project,
  Blog,
  ResourceDocument,
  ResourceCategory,
  Memory,
  Lead,
  TerminalCommand,
} from '@ub/types';

/**
 * Universal Data Layer Interface
 * Both Web (Next.js) and Mobile (Expo) consume these exact methods.
 */
export interface UbApiClient {
  // Projects & Case Studies
  getProjects(): Promise<Project[]>;
  getProjectBySlug(slug: string): Promise<Project | null>;

  // Technical Blogs
  getBlogs(): Promise<Blog[]>;
  getBlogBySlug(slug: string): Promise<Blog | null>;

  // Resources & Folder Tree
  getResourceCategories(): Promise<ResourceCategory[]>;
  getResourcesByCategory(categoryPath: string[]): Promise<ResourceDocument[]>;

  // Milestone Memories
  getMemories(): Promise<Memory[]>;

  // Leads & Estimator
  submitLead(lead: Omit<Lead, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; id?: string }>;

  // Terminal Console
  getTerminalCommands(): Promise<TerminalCommand[]>;
}
