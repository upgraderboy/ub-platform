import { Project } from '@ub/types';

export const PROJECTS_DATA: Project[] = [
  // 1. Featured Flagship (Winner) - Dec 2024
  {
    id: 'proj-1',
    title: 'Smart India Hackathon 2024 - EV Fleet Balancing Grid',
    slug: 'sih-2024-ev-fleet-network',
    shortDescription:
      'National 1st Prize Winner (Ministry of Power). Real-time IoT telematics grid and automated charge load optimization engine for commercial electric vehicle fleets.',
    category: 'iot',
    status: 'winner',
    tags: ['IoT', 'Node.js', 'Next.js 15', 'WebSockets', 'Python AI', 'PostgreSQL'],
    coverImage: 'https://images.unsplash.com/photo-1558441719-8b489c63f79b?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://upgraderboy.com',
    githubUrl: 'https://github.com/upgraderboy',
    featured: true,
    order: 1,
    createdAt: '2024-12-15T00:00:00Z',
    updatedAt: '2024-12-16T00:00:00Z',
    caseStudy: {
      problem: 'Uncoordinated commercial EV charging creates severe peak transformer overload in logistics depots.',
      solution: 'Decentralized IoT telematics hub paired with automated dynamic queuing that flattens grid peak by 38%.',
      keyFeatures: [
        'Sub-100ms MQTT/WebSocket battery state telemetry stream',
        'Dynamic tariff arbitrage scheduling charging during off-peak and solar hours',
        'Safety circuit breakers protecting local transformer threshold capacity',
      ],
      challenges: 'Handling sporadic network dropouts across depot locations using offline SQLite sync.',
      results: '1st Prize Nationally at SIH 2024 out of 50,000+ teams, praised by Ministry of Power evaluators.',
    },
  },

  // 2. In Active Development - Current
  {
    id: 'proj-in-progress-1',
    title: 'UB Platform v2.0 - Decoupled Monorepo Architecture',
    slug: 'ub-platform-v2',
    shortDescription:
      'Next-generation agency ecosystem featuring physical blast-radius decoupling between customer web, decoupled CMS admin portal, and Expo mobile app.',
    category: 'fullstack',
    status: 'in_development',
    tags: ['Turborepo', 'Next.js 15', 'React 19', 'Tailwind v4', 'Bun', 'Zod'],
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'http://localhost:3005',
    githubUrl: 'https://github.com/upgraderboy',
    featured: true,
    order: 2,
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
    caseStudy: {
      problem: 'Coupled CMS and marketing websites suffer from shared blast radius where admin bugs take down public web traffic.',
      solution: 'Physically isolated Turborepo workspaces where apps/web and apps/admin deploy independently sharing only validated packages.',
      keyFeatures: [
        'Dual-theme (Dark/Light) master design token architecture with 5 accent palettes',
        'Interactive in-browser developer shell terminal with command pipeline',
        'Lighthouse 100/100 Core Web Vitals target',
      ],
      challenges: 'Eliminating cross-workspace module leaks and maintaining sub-second Bun compilation times.',
      results: 'Zero deployment regressions and sub-second cold starts across all sub-applications.',
    },
  },

  // 3. In Active Development - Current
  {
    id: 'proj-in-progress-2',
    title: 'Agentic PR Reviewer - Autonomous AST Linter',
    slug: 'agentic-pr-reviewer',
    shortDescription:
      'Cloud-native GitHub Action bot parsing TypeScript AST syntax trees and executing semantic security reviews using Gemini Flash.',
    category: 'ai',
    status: 'in_development',
    tags: ['Gemini API', 'TypeScript', 'AST Parser', 'Docker', 'GitHub Actions'],
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://upgraderboy.com',
    githubUrl: 'https://github.com/upgraderboy',
    featured: false,
    order: 3,
    createdAt: '2024-11-20T00:00:00Z',
    updatedAt: '2024-11-25T00:00:00Z',
    caseStudy: {
      problem: 'Senior engineers spend 10+ hours weekly catching routine edge cases and type mismatches.',
      solution: 'Automated PR worker with confidence scoring that drafts inline GitHub suggestions only for verified issues.',
      keyFeatures: [
        'AST diff traversal that skips lockfiles and auto-generated code',
        'Direct one-click suggestion commits on pull requests',
        'Strict confidence threshold filter preventing noisy comments',
      ],
      results: '44% reduction in PR turnaround time during private team beta testing.',
    },
  },

  // 4. Shipped - October 2024
  {
    id: 'proj-oct-1',
    title: 'Enterprise Multi-Tenant CRM & Client Portal',
    slug: 'enterprise-crm-portal',
    shortDescription:
      'High-security client management dashboard with end-to-end RBAC, invoice lifecycles, and real-time project milestone tracking.',
    category: 'fullstack',
    status: 'shipped',
    tags: ['Next.js', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Stripe'],
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://upgraderboy.com',
    githubUrl: 'https://github.com/upgraderboy',
    featured: true,
    order: 4,
    createdAt: '2024-10-18T00:00:00Z',
    updatedAt: '2024-10-25T00:00:00Z',
    caseStudy: {
      problem: 'Growing consultancy needed a unified portal replacing 4 disjointed tools for contracts, invoices, and files.',
      solution: 'Custom Next.js client hub with role-based access, automated invoice delivery, and milestone tracking.',
      keyFeatures: [
        'Granular role-based permissions (Admin, Project Lead, Client Guest)',
        'Automated payment reconciliation with webhook audit trails',
        'Secure signed document uploads with expiration links',
      ],
      results: 'Saved client team 15+ administrative hours per month with zero billing disputes.',
    },
  },

  // 5. Shipped - August 2024
  {
    id: 'proj-aug-1',
    title: 'StudyDeck - Cross-Platform Offline Notes & Flashcards',
    slug: 'studydeck-mobile-app',
    shortDescription:
      'React Native & Expo companion app with SQLite local caching, spaced repetition flashcards, and instant PDF chapter extraction.',
    category: 'mobile',
    status: 'shipped',
    tags: ['React Native', 'Expo SDK 52', 'SQLite', 'TypeScript', 'Tailwind'],
    coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://upgraderboy.com',
    githubUrl: 'https://github.com/upgraderboy',
    featured: false,
    order: 5,
    createdAt: '2024-08-12T00:00:00Z',
    updatedAt: '2024-08-20T00:00:00Z',
    caseStudy: {
      problem: 'Engineering college students lose cellular data during daily commute and need quick access to course PDFs.',
      solution: 'Offline-first SQLite mobile app indexing notes locally with full-text search and spaced repetition review.',
      keyFeatures: [
        '100% offline access to all downloaded course materials',
        'Spaced repetition algorithm (SuperMemo SM-2) for mastering core algorithms',
        'Native 60 FPS transitions using React Native Reanimated',
      ],
      results: 'Used by 500+ undergraduate students across Shekhawati region colleges with 4.8-star satisfaction.',
    },
  },

  // 6. Shipped - May 2024
  {
    id: 'proj-may-1',
    title: 'CloudOps CI/CD Automation Matrix',
    slug: 'cloudops-cicd-matrix',
    shortDescription:
      'Reusable GitHub Actions workflows with automated container security scanning, semver tagging, and blue/green cloud deploy orchestration.',
    category: 'devops',
    status: 'shipped',
    tags: ['Docker', 'GitHub Actions', 'AWS ECS', 'Bash', 'Terraform'],
    coverImage: 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://upgraderboy.com',
    githubUrl: 'https://github.com/upgraderboy',
    featured: false,
    order: 6,
    createdAt: '2024-05-14T00:00:00Z',
    updatedAt: '2024-05-20T00:00:00Z',
    caseStudy: {
      problem: 'Development team suffered from manual SSH deployments prone to configuration drift and downtime.',
      solution: 'Zero-touch CI/CD pipeline triggered on git merge with automatic rollback triggers.',
      keyFeatures: [
        'Trivy automated container vulnerability vulnerability scanning',
        'Zero-downtime blue/green traffic cutover',
        'Automated Slack/Discord deployment status webhooks',
      ],
      results: 'Reduced deployment failure rate from 18% down to 0% with 3-minute average pipeline execution.',
    },
  },

  // 7. Shipped - February 2024
  {
    id: 'proj-feb-1',
    title: 'Upgrader Shell v1.0 - Interactive Web CLI',
    slug: 'upgrader-shell-web',
    shortDescription:
      'Lightweight JavaScript terminal engine allowing visitors to explore developer resumes, projects, and contact info via command line.',
    category: 'opensource',
    status: 'shipped',
    tags: ['TypeScript', 'Terminal', 'CLI', 'CSS Animations', 'Open Source'],
    coverImage: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1200&q=80',
    demoUrl: 'https://upgraderboy.com/#terminal',
    githubUrl: 'https://github.com/upgraderboy',
    featured: false,
    order: 7,
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    caseStudy: {
      problem: 'Traditional portfolios feel generic and fail to show developers love for command-line craftsmanship.',
      solution: 'In-browser interactive bash simulator with tab completion, history buffer, and custom easter eggs.',
      keyFeatures: [
        'Tab auto-completion for known commands',
        'Up/Down arrow key command history navigation',
        'Extensible plugin architecture for custom commands',
      ],
      results: 'Garnered 10,000+ views on developer forums and inspired dozens of community terminal forks.',
    },
  },
];
