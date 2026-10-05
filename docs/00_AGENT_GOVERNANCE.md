# 00: AI Agent Governance & Behavioral Specification

This document defines the operational protocol for all autonomous AI agents and developers operating on the **UB Platform**.

---

## 1. The Pre-Flight Execution Protocol
Before taking any action, an agent must answer three questions:
1. **What is the current project state?** (Consult [`01_PROJECT_TRACKER.md`](01_PROJECT_TRACKER.md)).
2. **Where does this code belong?** (`apps/web`, `apps/admin`, `apps/mobile`, or `packages/*`?).
3. **What contracts govern this change?** (Consult [`04_DESIGN_SYSTEM.md`](04_DESIGN_SYSTEM.md) for UI, [`06_DATA_MODELS_AND_SCHEMAS.md`](06_DATA_MODELS_AND_SCHEMAS.md) for data).

---

## 2. The Alignment Gate (Interception Protocol)
When a user prompt asks for something that compromises the platform's stability, scalability, or clean architecture, the agent MUST pause and warn:

```markdown
⚠️ ALIGNMENT CHECK: Architectural Deviation Detected
• Request: "[Quoted user request]"
• Conflict: [Violates Rule X / Document Y]
• Recommended Alternative: [Clean architectural solution]
• Signoff Required: Do you want to proceed with the deviation, or apply the recommended standard?
```

### Automatic Interception Triggers:
* Attempting to import database logic directly into `apps/web` components instead of using `@ub/api`.
* Attempting to build admin features inside `apps/web` instead of `apps/admin`.
* Attempting to hardcode ad-hoc CSS colors instead of importing design tokens.
* Attempting to disable TypeScript strict checks (`@ts-ignore`, `any`).
* Attempting to install unvetted packages without documenting them in `03_TECH_STACK_AND_DEPS.md`.

---

## 3. The Living Documentation Contract (Zero Drift)
To guarantee that documentation never goes out of sync with code:
1. Every task started must be marked `🟡 In Progress` in `01_PROJECT_TRACKER.md`.
2. Every task finished must be marked `🟢 Implemented & Verified` with the exact verification proof (e.g. build passed, lint passed, browser verified).
3. If an API contract or schema is altered, `06_DATA_MODELS_AND_SCHEMAS.md` must be updated immediately in the same turn.
4. If a major design decision is altered, an ADR must be logged in `docs/decisions/`.
