import {
  ProjectSchema,
  BlogSchema,
  ResourceCategorySchema,
  ResourceDocumentSchema,
  MemorySchema,
  LeadSchema,
  TerminalCommandSchema,
} from '../packages/types/src';

console.log('🧪 Starting Schema Smoke Tests...');

// 1. Test Project Schema
const validProject = ProjectSchema.safeParse({
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
if (!validProject.success) {
  console.error('❌ ProjectSchema test failed:', validProject.error);
  process.exit(1);
}
console.log('✅ ProjectSchema: Validated');

// 2. Test Invalid Slug Rejected
const invalidSlug = ProjectSchema.safeParse({
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
if (invalidSlug.success) {
  console.error('❌ ProjectSchema failed to reject invalid slug!');
  process.exit(1);
}
console.log('✅ ProjectSchema: Rejected invalid slug');

// 3. Test Recursive Resource Category Schema
const validCategoryTree = ResourceCategorySchema.safeParse({
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
if (!validCategoryTree.success) {
  console.error('❌ ResourceCategorySchema test failed:', validCategoryTree.error);
  process.exit(1);
}
console.log('✅ ResourceCategorySchema: Recursive tree validated');

console.log('🎉 ALL SMOKE TESTS PASSED CLEANLY!');
