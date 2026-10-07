import type { ResourceCategory, ResourceDocument } from '@ub/types';

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    id: 'cat-cs',
    name: 'Computer Science & Core',
    slug: 'computer-science',
    children: [
      {
        id: 'cat-cs-dsa',
        name: 'Data Structures & Algorithms',
        slug: 'data-structures-and-algorithms',
        parentId: 'cat-cs',
        children: [
          {
            id: 'cat-cs-dsa-advanced',
            name: 'Advanced Trees, Graphs & Dynamic Programming',
            slug: 'trees-graphs-dp',
            parentId: 'cat-cs-dsa',
          },
          {
            id: 'cat-cs-dsa-interviews',
            name: 'FAANG Interview Patterns & Grind Sheets',
            slug: 'interview-patterns',
            parentId: 'cat-cs-dsa',
          },
        ],
      },
      {
        id: 'cat-cs-system-design',
        name: 'Distributed Systems & System Design',
        slug: 'distributed-systems',
        parentId: 'cat-cs',
      },
      {
        id: 'cat-cs-dbms',
        name: 'Database Engineering & SQL',
        slug: 'database-engineering',
        parentId: 'cat-cs',
      },
    ],
  },
  {
    id: 'cat-hackathons',
    name: 'Hackathon Playbooks',
    slug: 'hackathon-playbooks',
    children: [
      {
        id: 'cat-hackathons-sih',
        name: 'Smart India Hackathon (SIH 2024 1st Prize)',
        slug: 'sih-2024-blueprint',
        parentId: 'cat-hackathons',
      },
      {
        id: 'cat-hackathons-decks',
        name: 'Winning Pitch Decks & System Schematics',
        slug: 'winning-pitch-decks',
        parentId: 'cat-hackathons',
      },
    ],
  },
  {
    id: 'cat-fullstack',
    name: 'Full-Stack & Cloud',
    slug: 'full-stack-cloud',
    children: [
      {
        id: 'cat-fullstack-nextjs',
        name: 'Next.js 15 & Turbopack Blueprints',
        slug: 'nextjs-15-blueprints',
        parentId: 'cat-fullstack',
        children: [
          {
            id: 'cat-fullstack-nextjs-arch',
            name: 'Turborepo Monorepo & Blast-Radius Architecture',
            slug: 'monorepo-blast-radius',
            parentId: 'cat-fullstack-nextjs',
          },
          {
            id: 'cat-fullstack-nextjs-perf',
            name: 'Turbopack Benchmarks & Edge Streaming',
            slug: 'benchmarks-edge-streaming',
            parentId: 'cat-fullstack-nextjs',
          },
        ],
      },
      {
        id: 'cat-fullstack-security',
        name: 'Web API Security & JWT Hardening',
        slug: 'web-api-security',
        parentId: 'cat-fullstack',
      },
    ],
  },
];

export const RESOURCE_DOCUMENTS: ResourceDocument[] = [
  {
    id: 'res-dsa-mastery-notes',
    title: 'Visual Data Structures & Algorithms Playbook (Arrays, Trees, Graphs, DP)',
    description: 'Comprehensive, handcrafted visual algorithm breakdown covering two-pointer techniques, tree traversals, Dijkstra shortest paths, and dynamic programming state transitions with time complexity analysis.',
    pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/examples/learning/helloworld.pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=800&q=80',
    source: 'Upgrader Boy Engineering Mentorship',
    fileSizeBytes: 4850000, // 4.85 MB
    categoryPath: ['cat-cs', 'cat-cs-dsa'],
    tags: ['DSA', 'Algorithms', 'Graphs', 'Dynamic Programming', 'Interview Prep'],
    publishedAt: '2025-01-10T12:00:00Z',
    fileExtension: 'pdf',
  },
  {
    id: 'res-system-design-cheatsheet',
    title: 'Distributed System Design Cheatsheet: High-Throughput & Low-Latency Patterns',
    description: 'Battle-tested architectural blueprints for scaling distributed applications. Includes Redis Streams Pub/Sub, WebSockets horizontal scaling, database sharding, and consistent hashing algorithms.',
    pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/examples/learning/helloworld.pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    source: 'Upgrader Boy Architectural Lab',
    fileSizeBytes: 3200000, // 3.2 MB
    categoryPath: ['cat-cs', 'cat-cs-system-design'],
    tags: ['System Design', 'Redis', 'WebSockets', 'Scalability', 'Microservices'],
    publishedAt: '2024-12-28T10:00:00Z',
    fileExtension: 'docx',
  },
  {
    id: 'res-sih-2024-grand-finale-deck',
    title: 'Smart India Hackathon 2024 National 1st Prize Presentation & Technical Blueprint',
    description: 'The exact winning slide deck and hardware-software system schematics presented to the Ministry of Power jury. Outlines real-time EV fleet current balancing and substation harmonic protection.',
    pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/examples/learning/helloworld.pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    source: 'Team Upgrader Boy (SIH 2024 1st Prize Winners)',
    fileSizeBytes: 6700000, // 6.7 MB
    categoryPath: ['cat-hackathons', 'cat-hackathons-sih'],
    tags: ['SIH 2024', 'Hackathon', 'EV Telematics', 'IoT', 'National Winner'],
    publishedAt: '2024-12-22T16:00:00Z',
    fileExtension: 'pptx',
  },
  {
    id: 'res-nextjs-15-monorepo-checklist',
    title: 'Next.js 15 & Turborepo Production Readiness Checklist (React 19 & App Router)',
    description: 'Pre-flight production verification audit for modern monorepos. Covers physical blast-radius isolation, Turbopack fast-refresh optimization, head script hydration, and Zod runtime schema boundaries.',
    pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/examples/learning/helloworld.pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    source: 'Upgrader Boy Agency Standards',
    fileSizeBytes: 2100000, // 2.1 MB
    categoryPath: ['cat-fullstack', 'cat-fullstack-nextjs'],
    tags: ['Next.js 15', 'Turbopack', 'Monorepo', 'React 19', 'TypeScript'],
    publishedAt: '2025-01-05T09:00:00Z',
    fileExtension: 'txt',
  },
  {
    id: 'res-dbms-sql-optimization-guide',
    title: 'Database Systems & SQL Query Optimization: B-Tree Indexes & ACID Mastery',
    description: 'Practical guide to query performance engineering. Features index selectivity, execution plan analysis, deadlock prevention, and database normalization versus denormalization trade-offs.',
    pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/examples/learning/helloworld.pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
    source: 'Upgrader Boy Technical Notes',
    fileSizeBytes: 3900000, // 3.9 MB
    categoryPath: ['cat-cs', 'cat-cs-dbms'],
    tags: ['DBMS', 'SQL', 'PostgreSQL', 'Indexing', 'Query Optimization'],
    publishedAt: '2024-11-18T14:00:00Z',
    fileExtension: 'pdf',
  },
  {
    id: 'res-web-api-security-matrix',
    title: 'Full-Stack Web API Security Hardening: JWT Rotation & Rate Limiting Protocols',
    description: 'Defense-in-depth security matrix for Node.js and Next.js applications. Covers secure cookie handling, CSRF defense, role-based authorization (RBAC), and sliding-window rate limiters.',
    pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/examples/learning/helloworld.pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    source: 'Upgrader Boy Security Research',
    fileSizeBytes: 2800000, // 2.8 MB
    categoryPath: ['cat-fullstack', 'cat-fullstack-security'],
    tags: ['Security', 'JWT', 'RBAC', 'Auth', 'API Hardening'],
    publishedAt: '2024-10-25T11:00:00Z',
    fileExtension: 'md',
  },
  {
    id: 'res-hackathon-winning-pitch-formula',
    title: 'The 3-Minute Hackathon Pitch Formula: From Jury Hook to High-Impact Technical Demo',
    description: 'The proven pitching playbook that won us 1st prize at national hackathons. How to structure problem articulation, live demo risk mitigation, and executive jury Q&A handling under time limits.',
    pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/examples/learning/helloworld.pdf',
    thumbnailUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    source: 'Upgrader Boy Founder Playbooks',
    fileSizeBytes: 1800000, // 1.8 MB
    categoryPath: ['cat-hackathons', 'cat-hackathons-decks'],
    tags: ['Pitching', 'Hackathon Strategy', 'Demo Day', 'Public Speaking', 'Founder Notes'],
    publishedAt: '2024-11-02T15:00:00Z',
    fileExtension: 'docx',
  },
];
