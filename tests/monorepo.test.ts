import { describe, test, expect } from 'bun:test';
import {
  ProjectSchema,
  BlogSchema,
  ResourceCategorySchema,
  ResourceDocumentSchema,
  MemorySchema,
  LeadSchema,
  TerminalCommandSchema,
} from '../packages/types/src';
import { colors, accents, typography } from '../packages/ui/src/tokens';

describe('UB Platform Monorepo Test Suite', () => {
  describe('Zod Data Models & Schemas', () => {
    test('ProjectSchema accepts valid project payload', () => {
      const result = ProjectSchema.safeParse({
        id: 'proj-1',
        title: 'UB Platform 2.0',
        slug: 'ub-platform',
        shortDescription: 'Enterprise Turborepo monorepo with Web and Mobile',
        category: 'fullstack',
        tags: ['Next.js', 'React Native', 'Turborepo'],
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
        demoUrl: 'https://upgraderboy.com',
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      expect(result.success).toBe(true);
    });

    test('ProjectSchema strictly rejects invalid slug formatting', () => {
      const result = ProjectSchema.safeParse({
        id: 'proj-2',
        title: 'Bad Project',
        slug: 'INVALID SLUG WITH SPACES!',
        shortDescription: 'Should fail',
        category: 'frontend',
        tags: [],
        coverImage: 'https://example.com/img.png',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      expect(result.success).toBe(false);
    });

    test('ResourceCategorySchema validates recursive tree hierarchy', () => {
      const result = ResourceCategorySchema.safeParse({
        id: 'cat-root',
        name: 'Computer Science',
        slug: 'cs',
        children: [
          {
            id: 'cat-child',
            name: 'Data Structures & Algorithms',
            slug: 'dsa',
            children: [],
          },
        ],
      });
      expect(result.success).toBe(true);
    });

    test('LeadSchema validates client inquiry payload', () => {
      const result = LeadSchema.safeParse({
        id: 'lead-1',
        name: 'John Doe',
        email: 'john@example.com',
        projectType: 'web',
        budgetRange: '$1k - $3k',
        timeline: '1-2 months',
        description: 'Looking for a high-performance Next.js application.',
        status: 'new',
        createdAt: new Date().toISOString(),
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Master Design Tokens & Dual Theme System', () => {
    test('Accents definition contains all 5 approved themes', () => {
      expect(accents.green.color).toBe('#00FF1E');
      expect(accents.cyan.color).toBe('#00D2FF');
      expect(accents.purple.color).toBe('#BD5FFF');
      expect(accents.rose.color).toBe('#FF3366');
      expect(accents.orange.color).toBe('#FF9900');
    });

    test('Dark and Light theme surfaces are properly configured', () => {
      expect(colors.dark.bgBase).toBe('#0B0F19');
      expect(colors.light.bgBase).toBe('#F8FAFC');
      expect(typography.fonts.heading).toContain('Poppins');
    });
  });
});
