# AGENTS.md: UB Platform AI Agent Constitution & Behavioral Protocol

> **Universal Directive:** This document governs any AI agent (Antigravity, Claude, GPT, Cursor, Copilot) or human developer working on the **UB Platform (Upgrader Boy)** repository. 
> You MUST read this document and the referenced `docs/` specifications before writing, editing, or executing any code.

---

## 🚨 The Core Laws of the Repository

### LAW 1: Context & Pre-Flight Check (Read Before Touch)
* **Zero Blind Execution:** You are strictly forbidden from writing or modifying code without first understanding the active project state.
* **Pre-Flight Inspection Checklist:**
  1. Read `docs/01_PROJECT_TRACKER.md` to identify the current phase, active tasks, and what has already been verified.
  2. Inspect `docs/02_ARCHITECTURE.md` to ensure your proposed changes respect monorepo boundaries and blast-radius isolation.
  3. Inspect `docs/03_TECH_STACK_AND_DEPS.md` to ensure no unvetted or duplicate packages are introduced.
  4. Inspect `docs/04_DESIGN_SYSTEM.md` whenever adding or modifying UI components.

---

### LAW 2: The Alignment Gate (Pause & Warn)
If a user prompt or requested action conflicts with our established architecture, fault-isolation rules, design tokens, or documentation:
* **DO NOT blindly execute the change.**
* **DO NOT use hacks or quick workarounds.**
* **HALT and issue an Alignment Warning:**
  ```markdown
  ⚠️ ALIGNMENT CHECK: Architectural Deviation Detected
  • Requested Action: [Describe the request that deviates]
  • Conflicting Standard: [Quote the rule or doc section it violates]
  • Recommended Standard: [Provide the clean, compliant solution]
  • Decision Required: Do you want to proceed with this deviation, or should we follow our architectural standard?
  ```

---

### LAW 3: Strict Blast-Radius & Fault-Isolation Rules
1. **Never couple the Admin CMS into the Public Web app:** 
   * `apps/web` (upgraderboy.com) and `apps/admin` (admin.upgraderboy.com) are **physically decoupled applications**.
   * An error, crash, or heavy process in `apps/admin` must **never** affect `apps/web`.
2. **Shared Code Belongs in `packages/*`:**
   * Any TypeScript types, Zod schemas, API clients, or UI tokens shared between Web and Mobile must live in `packages/types`, `packages/api`, or `packages/ui`.
   * Cross-app direct imports (e.g. importing from `apps/mobile` inside `apps/web`) are strictly prohibited.
3. **No Unvalidated Data Ingestion:**
   * All API routes, form submissions, and external payloads must pass through Zod validation schemas defined in `packages/types`.

---

### LAW 4: Engineering Quality & Zero-Shortcut Standards
* **BANNED:** Using `@ts-ignore`, `any`, or `// eslint-disable` to silence compiler/linter errors.
* **BANNED:** Deleting or commenting out tests to achieve green builds.
* **BANNED:** Using arbitrary inline styling (e.g., `style={{ color: '#1a2b3c' }}`) instead of design tokens from `docs/04_DESIGN_SYSTEM.md`.
* **BANNED:** Storing secrets in client-side bundles. All `.env` variables must follow `docs/08_ENVIRONMENT_AND_SECRETS.md`.

---

### LAW 5: Content Curation & Professional Copywriting
* **Zero Dummy / Placeholder Data:** Never import test strings (e.g. *"This is short description. But now it is not short..."*), empty testimonials, or dummy projects.
* **Executive Polish:** All copy, project descriptions, and service offerings must be written in high-impact, professional, agency-grade language.

---

### LAW 6: Synchronous Documentation Sync (Zero Drift)
* **Living Documentation:** Whenever you implement a feature, add a route, update a schema, or fix a bug, you **MUST update `docs/01_PROJECT_TRACKER.md` in the exact same turn**.
* If a new dependency is added, log it in `docs/03_TECH_STACK_AND_DEPS.md`.
* If an architectural decision changes, record an ADR in `docs/decisions/`.
* **No task is complete until both the code and the documentation are verified and synchronized.**

---

### LAW 7: Universal Agent Verification & Proof Collection Protocol
Before marking any task as complete in `docs/01_PROJECT_TRACKER.md`, the agent must:
1. Run `bun run check` (or `bun x turbo run check`) — Zero TypeScript errors.
2. Run `bun run lint` — Zero lint warnings or errors.
3. Run functional verification tests (`bun test`).
4. **Capture Visual Proof:** Store screenshot (`.png`) and/or screen recording (`.webp`) of the working feature inside `docs/verification/screenshots/` or `docs/verification/recordings/`.
5. **Link Evidence:** Explicitly link the verification media and command output in `docs/01_PROJECT_TRACKER.md`. Without attached proof, the task is NOT considered verified.

---

## 📚 Essential Reading Index
* System Status: [`docs/01_PROJECT_TRACKER.md`](docs/01_PROJECT_TRACKER.md)
* System Architecture: [`docs/02_ARCHITECTURE.md`](docs/02_ARCHITECTURE.md)
* Tech Stack & Dependencies: [`docs/03_TECH_STACK_AND_DEPS.md`](docs/03_TECH_STACK_AND_DEPS.md)
* Design System & Tokens: [`docs/04_DESIGN_SYSTEM.md`](docs/04_DESIGN_SYSTEM.md)
* Route & Page Catalog: [`docs/05_ROUTES_AND_PAGES.md`](docs/05_ROUTES_AND_PAGES.md)
* Data Models & Schemas: [`docs/06_DATA_MODELS_AND_SCHEMAS.md`](docs/06_DATA_MODELS_AND_SCHEMAS.md)
