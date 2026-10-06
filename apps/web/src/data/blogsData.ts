import type { Blog } from '@ub/types';

export const BLOGS_DATA: Blog[] = [
  {
    id: 'blog-nextjs-15-turbopack-monorepo',
    title: 'Architecting Next.js 15 & Turbopack Monorepos: Blast-Radius Isolation & Zero-Downtime Builds',
    slug: 'architecting-nextjs-15-turbopack-monorepos',
    excerpt: 'Deep dive into architecting enterprise-grade monorepos with Next.js 15 App Router, React 19, and Turbopack. Learn how to physically decouple admin CMS portals from public web apps while sharing zero-overhead types and design tokens.',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Next.js 15', 'Turbopack', 'Monorepo', 'Architecture', 'TypeScript'],
    status: 'published',
    readingTimeMinutes: 7,
    publishedAt: '2025-01-15T10:00:00Z',
    createdAt: '2025-01-15T09:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    content: `
### Executive Summary & Motivation

Modern engineering teams often stumble into the trap of monolithic entanglement: building their customer-facing web application, administrative dashboard, and background workers in a single codebase with coupled dependencies. When your admin CMS goes down or crashes memory limits during heavy data ingestion, your public storefront crashes alongside it.

In this deep architectural breakdown, we outline the exact pattern powering the **Upgrader Boy (UB) Platform**: an enterprise Turborepo monorepo with physical blast-radius isolation, React 19 server components, and sub-second Fast Refresh via Turbopack.

---

### Core Tenet: Physical Blast-Radius Isolation

We enforce a strict boundary between public applications and privileged internal portals:
- **apps/web** (\`upgraderboy.com\`): High-speed public brand hub, portfolio, and technical blogs running on Edge CDN. Zero admin code, zero session state baggage.
- **apps/admin** (\`admin.upgraderboy.com\`): Physically decoupled CMS with RBAC authentication, heavy rich-text editors, and database mutations.
- **packages/\\***: Strict contract layer containing pure Zod schemas (\`packages/types\`), shared UI design tokens (\`packages/ui\`), and API clients (\`packages/api\`).

\`\`\`typescript
// packages/types/src/blog.ts
import { z } from 'zod';

export const BlogSchema = z.object({
  id: z.string(),
  title: z.string().min(5),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(300),
  content: z.string().min(10),
  coverImage: z.string().url(),
  tags: z.array(z.string()),
  readingTimeMinutes: z.number().min(1),
  publishedAt: z.string().nullable(),
});

export type Blog = z.infer<typeof BlogSchema>;
\`\`\`

---

### Solving the Hydration FOIC (Flash of Inaccurate Content)

One of the most pervasive bugs in modern SSR applications is the theme/palette flash on refresh. When an SSR framework serves a static \`<html>\` element with a hardcoded dark theme, users in light mode experience a jarring blink during page reload.

To eliminate this, we inject an ultra-lightweight synchronous execution snippet in the \`<head>\` before any DOM paint:

\`\`\`html
<!-- Critical Head Snippet (Executes before first paint) -->
<script>
  (function() {
    try {
      var theme = localStorage.getItem('ub-theme-mode');
      var isDark = theme ? theme === 'dark' : true;
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      var color = localStorage.getItem('ub-accent-color');
      if (color) {
        document.documentElement.style.setProperty('--accent-color', color);
      }
    } catch (e) {}
  })();
</script>
\`\`\`

---

### Real-Time Turbopack Workflow

By leveraging Turbopack in Next.js 15 (\`next dev --turbopack\`), monorepo file resolution is instantaneous. Local changes to \`packages/ui\` or \`packages/types\` immediately trigger hot-reloading inside \`apps/web\` without manual recompilation scripts or long watcher cycles.

### Key Takeaways
1. Never import admin portal code inside your public consumer bundle.
2. Store shared domain models in Zod schemas for compile-time and runtime guarantee.
3. Use synchronous script execution in document head for instant zero-flash client preference hydration.
    `.trim(),
  },
  {
    id: 'blog-sih-2024-ev-telematics',
    title: 'Building Real-Time IoT Telematics with WebSockets, Node.js & Leaflet (Our SIH 2024 1st Prize Architecture)',
    slug: 'building-real-time-iot-telematics-sih-2024',
    excerpt: 'The technical blueprint behind our 1st Prize winning Smart India Hackathon 2024 project. How we processed 10,000 concurrent EV telemetry packets per second with Redis Pub/Sub, geofencing algorithms, and adaptive load balancing.',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    tags: ['IoT', 'WebSockets', 'SIH 2024', 'Node.js', 'System Design'],
    status: 'published',
    readingTimeMinutes: 9,
    publishedAt: '2024-12-20T14:30:00Z',
    createdAt: '2024-12-20T12:00:00Z',
    updatedAt: '2024-12-20T14:30:00Z',
    content: `
### Background & The SIH 2024 Challenge

At the Smart India Hackathon (SIH) 2024, our team tackled a mission-critical problem statement issued by the Ministry of Power: **Managing Grid Stability in High-Density EV Charging Corridors**.

When hundreds of commercial electric vehicles plug into fast chargers simultaneously during peak grid hours, local transformers face severe harmonic distortion and brownout risks. Our solution—the **EV Fleet Balancing Grid**—ingested live battery state-of-charge (SoC), route telemetry, and transformer heat sensor data to dynamically throttle charging currents and reroute fleet vehicles.

---

### High-Throughput Ingestion Architecture

Each simulated EV hardware beacon emitted a 128-byte binary packet every 500ms containing:
- GPS coordinates (Latitude, Longitude, Altitude)
- Battery state-of-charge (SoC percentage & cell temperature)
- Instantaneous power draw (kW)
- Vehicle cryptographic identifier

To prevent database bottlenecking, we bypassed direct relational writes and built an in-memory Redis ingestion pipeline:

\`\`\`typescript
// IoT Ingestion Handler
import { WebSocketServer, WebSocket } from 'ws';
import { createClient } from 'redis';

const redisPublisher = createClient({ url: process.env.REDIS_URL });
await redisPublisher.connect();

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', async (data: Buffer) => {
    try {
      const packet = decodeTelemetryBinary(data);
      
      // Publish to distributed Redis stream for worker consensus
      await redisPublisher.xAdd('stream:telemetry', '*', {
        vehicleId: packet.vehicleId,
        lat: packet.lat.toString(),
        lng: packet.lng.toString(),
        soc: packet.soc.toString(),
        timestamp: Date.now().toString(),
      });
    } catch (err) {
      console.error('Packet parsing drop:', err);
    }
  });
});
\`\`\`

---

### Dynamic Sub-Station Load Balancing Algorithm

Our optimizer evaluated grid capacity every 3 seconds using quadratic constraint optimization. If a substation exceeded 85% rated thermal load:
1. Chargers were instructed over WebSockets to taper from 150kW to 60kW.
2. In-transit delivery vans with SoC > 45% received automated in-dash reroutes to adjacent low-stress sub-stations.

\`\`\`typescript
interface GridNode {
  substationId: string;
  currentLoadKw: number;
  maxCapacityKw: number;
}

export function calculateThrottleFactor(node: GridNode): number {
  const utilization = node.currentLoadKw / node.maxCapacityKw;
  if (utilization <= 0.70) return 1.0; // Full 100% speed
  if (utilization <= 0.85) return 0.75; // 75% load
  if (utilization <= 0.95) return 0.40; // Critical load shedding
  return 0.15; // Emergency trickle rate
}
\`\`\`

### Results & Hackathon Outcome
- Ingested **12,400 simultaneous vehicle streams** with p99 latency under 42ms.
- Successfully demonstrated automated grid blackout prevention under simulated transformer failure.
- Awarded **National 1st Prize (₹1,00,000)** by the Grand Finale Jury.
    `.trim(),
  },
  {
    id: 'blog-learn-in-public-software-agency',
    title: 'The "Learn in Public" Blueprint: How Radical Transparency Scaled Our Agency to 15+ Enterprise Deliverables',
    slug: 'learn-in-public-software-agency-blueprint',
    excerpt: 'Why traditional stealth-mode agencies struggle to build trust, and how documenting our engineering failures, daily PRs, and architectural decisions in public created an organic pipeline of high-ticket consulting clients.',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Engineering Culture', 'Learn In Public', 'Leadership', 'Agency Growth'],
    status: 'published',
    readingTimeMinutes: 6,
    publishedAt: '2024-11-10T16:00:00Z',
    createdAt: '2024-11-10T14:00:00Z',
    updatedAt: '2024-11-10T16:00:00Z',
    content: `
### The Myth of the Stealth Agency

In the traditional software consulting industry, agencies hide their junior developers behind flashy sales presentations. Codebases remain locked behind NDAs, architectural trade-offs are swept under the rug, and clients only see the final build when it is too late to fix systemic design flaws.

When founding **Upgrader Boy** in Jhunjhunu, Rajasthan, we deliberately inverted this paradigm. We committed to **Radical Transparency: Learning & Building in Public**.

---

### The Three Pillars of Learn in Public

#### 1. Daily Architectural Proof Over Marketing Copy
Instead of writing vague claims like *"We build scalable cloud software"*, we publish actual Architecture Decision Records (ADRs), benchmarking scripts, and failure post-mortems. When enterprise founders evaluate our agency, they don't look at brochures—they inspect our git commits and system design diagrams.

#### 2. Community Mentorship as Quality Assurance
By conducting open technical workshops and mentoring over 1,000+ engineering students across Rajasthan and national hackathon circuits, our core engineering team is forced to articulate complex concepts with absolute clarity. If an engineer cannot explain a database indexing strategy or WebSocket protocol to a sophomore, they cannot architect it reliably for an enterprise client.

#### 3. Living Documentation Protocols
Every project we ship has living documentation embedded directly inside the codebase. As codified in our system constitution (\`AGENTS.md\`):
- **Law 1: Pre-Flight Check:** Read before writing.
- **Law 5: Content Curation:** Zero placeholder strings.
- **Law 6: Synchronous Documentation Sync:** Code and documentation must update in the same turn.

\`\`\`markdown
## Standard Upgrader Boy ADR Structure
1. Title & Status: (Proposed / Accepted / Superseded)
2. Context & Problem Statement: The business driver
3. Decision: What architecture path was chosen
4. Consequences & Trade-offs: Positive & negative implications
\`\`\`

### Impact
Over the last 18 months, 100% of our inbound client engagements arrived organically through open technical articles, hackathon demonstrations, and developer word-of-mouth.
    `.trim(),
  },
  {
    id: 'blog-modern-web-security-mern',
    title: 'Hardening Full-Stack MERN & Next.js: JWT Rotation, Strict RBAC & Edge Rate Limiting',
    slug: 'hardening-full-stack-mern-nextjs-security',
    excerpt: 'Comprehensive security playbook for modern web applications. Preventing session hijacking with HTTP-only refresh tokens, enforcing type-safe role-based access control, and mitigating DDoS attacks with sliding-window rate limiters.',
    coverImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    tags: ['Security', 'MERN Stack', 'Next.js', 'Auth', 'Node.js'],
    status: 'published',
    readingTimeMinutes: 8,
    publishedAt: '2024-10-05T11:00:00Z',
    createdAt: '2024-10-05T09:00:00Z',
    updatedAt: '2024-10-05T11:00:00Z',
    content: `
### Introduction: The Vulnerability Landscape

Full-stack applications built on Node.js and Next.js are the backbone of modern web startups, but standard tutorials frequently teach unsafe shortcuts: storing raw JWT tokens in browser \`localStorage\`, skipping CORS whitelisting, and trusting unvalidated client JSON payloads.

In this technical breakdown, we walk through our agency's production security protocol for hardening web APIs.

---

### 1. Dual-Token Authentication with Silent Refresh

Storing JWTs in \`localStorage\` leaves your application completely vulnerable to Cross-Site Scripting (XSS). If an attacker injects a malicious third-party script, they can read the token and impersonate the user indefinitely.

Our architecture uses a split-token approach:
- **Access Token:** Short-lived (15 minutes), stored solely in memory (React context/state).
- **Refresh Token:** Long-lived (7 days), stored in an \`httpOnly\`, \`secure\`, \`sameSite: 'strict'\` cookie.

\`\`\`typescript
// Secure Refresh Cookie Configuration
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/api/auth/refresh', // Scoped exclusively to refresh route
});
\`\`\`

---

### 2. Distributed Sliding-Window Rate Limiting

To protect against brute-force credential stuffing and API abuse, we implement a sliding-window counter backed by Redis:

\`\`\`typescript
import { Redis } from 'ioredis';

const redis = new Redis(process.env.REDIS_URL!);

export async function checkRateLimit(ip: string, limit = 60, windowSeconds = 60): Promise<boolean> {
  const currentTimestamp = Date.now();
  const windowStart = currentTimestamp - (windowSeconds * 1000);
  const key = \`ratelimit:\${ip}\`;

  const multi = redis.multi();
  multi.zremrangebyscore(key, 0, windowStart);
  multi.zadd(key, currentTimestamp, \`\${currentTimestamp}:\${Math.random()}\`);
  multi.zcard(key);
  multi.expire(key, windowSeconds);

  const results = await multi.exec();
  const requestCount = results?.[2]?.[1] as number;

  return requestCount <= limit;
}
\`\`\`

---

### 3. Zod-Powered Runtime Ingestion Guardrails

Every incoming API payload must be strictly validated before touching your business logic or database. Any unexpected keys must be stripped immediately.

\`\`\`typescript
// Runtime payload validation
export async function validatePayload<T>(schema: z.ZodSchema<T>, data: unknown): Promise<T> {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(result.error.flatten());
  }
  return result.data;
}
\`\`\`

### Summary Checklist
- [x] Zero JWTs stored in \`localStorage\`.
- [x] Refresh tokens restricted to \`httpOnly\` cookies with \`SameSite=Strict\`.
- [x] Sliding-window rate limiters deployed on all authentication endpoints.
- [x] Strict Zod schemas sanitizing all external JSON payloads.
    `.trim(),
  },
];
