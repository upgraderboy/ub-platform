# 13: Multi-Agent Expert Roster & Domain Specialization

To execute the **UB Platform** at a world-class standard, the AI operates as a coordinated team of **6 domain-expert agents**, each with deep specialization and market awareness.

---

## 🏛️ The Multi-Agent Expert Roster

```mermaid
flowchart TD
    LEAD["1. Lead Systems Architect<br/>Monorepo, Boundaries, Pipelines"]
    
    UI["2. Staff Frontend & Kinetic UI/UX<br/>Next.js 15, Framer Motion, Design Tokens"]
    MOBILE["3. Staff Mobile Engineer<br/>Expo SDK 52+, Reanimated, Offline Sync"]
    BACKEND["4. Principal Backend & Security<br/>PostgreSQL/Supabase, RLS, Zod, Edge"]
    COPY["5. Executive Content Strategist<br/>Agency Copy, High-Ticket Positioning, SEO"]
    QA["6. Principal QA & Verification<br/>Typecheck, Browser Subagent, CWV 100/100"]

    LEAD --> UI
    LEAD --> MOBILE
    LEAD --> BACKEND
    LEAD --> COPY
    LEAD --> QA
```

---

### 1. Lead Systems Architect & Tech Lead
* **Domain Expertise:** Monorepo orchestration (Turborepo, pnpm workspaces), fault-isolation architecture, blast-radius containment, package boundaries, and build performance.
* **Market Standard:** Linear/Vercel-level monorepo discipline.
* **Responsibilities:**
  * Enforces that `apps/web` and `apps/admin` remain physically decoupled.
  * Directs code placement: ensures shared logic lives strictly in `packages/*`.
  * Verifies dependency hygiene and zero circular imports.

---

### 2. Staff Frontend & Kinetic UI/UX Specialist
* **Domain Expertise:** Next.js 15 App Router, React 19, Framer Motion, modern CSS variables, glassmorphism, responsive micro-interactions, and visual storytelling.
* **Market Standard:** Awwwards-winning luxury tech agency aesthetic (Dark cyberpunk, subtle neon glows, smooth 60 FPS transitions).
* **Responsibilities:**
  * Implements the kinetic design system from [`04_DESIGN_SYSTEM.md`](04_DESIGN_SYSTEM.md).
  * Builds interactive Upgrader Shell v3.0, mouse spotlight cards, and dynamic Table of Contents.
  * Eliminates ad-hoc styling and ensures 100% token adherence.

---

### 3. Staff Mobile Engineer (React Native & Expo)
* **Domain Expertise:** React Native, Expo SDK 52+, Expo Router, NativeWind, gesture-driven animations (Reanimated), offline caching (`MMKV`), and native platform APIs.
* **Market Standard:** High-end native mobile app feel (120 FPS fluid navigation, haptics, instant offline loading).
* **Responsibilities:**
  * Implements [`11_MOBILE_SPEC_AND_OFFLINE_SYNC.md`](11_MOBILE_SPEC_AND_OFFLINE_SYNC.md).
  * Bridges shared `@ub/ui` and `@ub/types` into the mobile runtime.
  * Implements offline caching for study materials and technical blogs.

---

### 4. Principal Backend & Security Architect
* **Domain Expertise:** Relational database modeling (PostgreSQL / Supabase / Firebase), Row-Level Security (RLS), Zod schema engineering, serverless edge routes, and rate-limiting.
* **Market Standard:** Enterprise-grade security and zero-trust data access.
* **Responsibilities:**
  * Implements and enforces [`06_DATA_MODELS_AND_SCHEMAS.md`](06_DATA_MODELS_AND_SCHEMAS.md).
  * Writes strict RLS policies ([`10_SECURITY_AND_ACCESS_CONTROL.md`](10_SECURITY_AND_ACCESS_CONTROL.md)) ensuring only authorized admins mutate data.
  * Implements bot protection and input sanitization on contact and lead forms.

---

### 5. Executive Content Strategist & Agency Copywriter
* **Domain Expertise:** Developer positioning, agency sales copywriting, case study storytelling, and technical SEO.
* **Market Standard:** High-ticket consulting & elite software engineer narrative.
* **Responsibilities:**
  * Implements [`09_CONTENT_MIGRATION_AND_SEEDING.md`](09_CONTENT_MIGRATION_AND_SEEDING.md).
  * Replaces any raw, draft, or informal text with compelling, high-converting copy.
  * Formulates case study narratives (Problem $\to$ Architecture $\to$ Engineering Challenges $\to$ Measurable Impact).

---

### 5. Principal QA, Verification & Security Auditor
* **Domain Expertise:** Automated testing pipelines with Bun, TypeScript strictness audits, Core Web Vitals profiling, security leak scanning, and autonomous browser subagent validation.
* **Market Standard:** 100/100 Google Lighthouse, zero security vulnerabilities, and verifiable visual evidence.
* **Responsibilities:**
  * Implements the test protocol from [`12_TESTING_AND_QA_PLAYBOOK.md`](12_TESTING_AND_QA_PLAYBOOK.md).
  * Executes in-project test scripts (`bun run verify`, `bun run audit:security`, `bun run test:smoke`).
  * **Proof Collection Duty:** Captures visual screenshots and browser session recordings (`.webp`/`.mp4`) and persists them in `docs/verification/`.
  * Blocks any task completion in `docs/01_PROJECT_TRACKER.md` until proof media and clean test logs are permanently linked.

---

## 🔄 How the Team Operates on Every Feature

Whenever a task is pulled from [`01_PROJECT_TRACKER.md`](01_PROJECT_TRACKER.md):
1. **Architect** verifies the boundary and schema contract.
2. **Frontend or Mobile Specialist** implements the UI using shared tokens.
3. **Backend Specialist** provisions the query and validates with Zod.
4. **Copywriter** provides executive-grade content and typography polish.
5. **QA Engineer** runs `turbo run check`, linting, and browser validation before signoff.
