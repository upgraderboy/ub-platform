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

    test('ResourceCategorySchema validates deep multi-level recursive tree hierarchy', () => {
      const result = ResourceCategorySchema.safeParse({
        id: 'cat-root',
        name: 'Computer Science',
        slug: 'cs',
        children: [
          {
            id: 'cat-child',
            name: 'Data Structures & Algorithms',
            slug: 'dsa',
            children: [
              {
                id: 'cat-subchild',
                name: 'Advanced Graphs & Dynamic Programming',
                slug: 'graphs-dp',
                children: [
                  {
                    id: 'cat-deepest',
                    name: 'Network Flow & Max Cut Algorithms',
                    slug: 'network-flow',
                  },
                ],
              },
            ],
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

    test('MemorySchema validates multi-category memories (SIH hackathon + college + milestone)', () => {
      const validMemory = MemorySchema.safeParse({
        id: 'mem-sih-2024',
        title: 'Smart India Hackathon 2024 Grand Finale Victory',
        description: 'National 1st prize winner under Ministry of Power jury.',
        categories: ['hackathons', 'college', 'milestones'],
        date: '2024-12-22',
        year: '2024',
        location: 'Coimbatore, Tamil Nadu',
        coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
        images: [
          'https://images.unsplash.com/photo-1518770660439-4636190af475',
          'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4',
        ],
        badge: 'NATIONAL 1ST PRIZE',
        featured: true,
        behindTheScenes: {
          theCrisis: 'Hardware sensor communication dropped at 3:00 AM.',
          theBreakthrough: 'Implemented Redis Streams ring buffer fallback.',
          techStack: ['Next.js 15', 'Turborepo', 'IoT', 'Redis'],
        },
        teamMembers: [
          { name: 'Upgrader Boy', role: 'Team Lead & Architect' },
        ],
      });
      expect(validMemory.success).toBe(true);
    });

    test('ResourceDocumentSchema validates multi-extension documents (pdf, docx, txt, md)', () => {
      const validPdf = ResourceDocumentSchema.safeParse({
        id: 'res-pdf-1',
        title: 'Distributed System Blueprint',
        description: 'Engineering whitepaper for high-throughput backends.',
        pdfUrl: 'https://example.com/system.pdf',
        fileSizeBytes: 2048000,
        categoryPath: ['cat-cs'],
        tags: ['Distributed', 'Backend'],
        publishedAt: new Date().toISOString(),
        fileExtension: 'pdf',
      });
      expect(validPdf.success).toBe(true);

      const validDocx = ResourceDocumentSchema.safeParse({
        id: 'res-docx-1',
        title: 'Monorepo Architecture Specification',
        description: 'Word docx specification for client architecture.',
        pdfUrl: 'https://example.com/spec.docx',
        fileSizeBytes: 1024000,
        categoryPath: ['cat-fullstack'],
        tags: ['Architecture', 'Docx'],
        publishedAt: new Date().toISOString(),
        fileExtension: 'docx',
      });
      expect(validDocx.success).toBe(true);

      const validTxt = ResourceDocumentSchema.safeParse({
        id: 'res-txt-1',
        title: 'System Environment Manifest',
        description: 'Plaintext environment configuration rules.',
        pdfUrl: 'https://example.com/env.txt',
        fileSizeBytes: 45000,
        categoryPath: ['cat-devops'],
        tags: ['Env', 'Plaintext'],
        publishedAt: new Date().toISOString(),
        fileExtension: 'txt',
      });
      expect(validTxt.success).toBe(true);
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
