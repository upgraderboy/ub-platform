# AI Agent Governance & Execution Rules

> Location: `.agents/rules/governance.md`
> Auto-loaded by Antigravity IDE and compliant with universal agent standards.

## Operating Principles
1. **Pre-flight verification:** Always inspect `docs/01_PROJECT_TRACKER.md` before initiating actions.
2. **Alignment Gate:** Any user prompt requesting shortcuts or breaking monorepo isolation must be intercepted with an Alignment Warning.
3. **No Drift:** Documentation (`docs/`) must be updated in lockstep with every code change.
4. **Clean Code Standard:** No `@ts-ignore`, no `any`, no ad-hoc inline styles. Use tokens from `docs/04_DESIGN_SYSTEM.md`.
5. **Decoupled Architecture:** `apps/web` and `apps/admin` are separate deployables. All shared logic lives in `packages/*`.

Refer directly to `AGENTS.md` and `docs/00_AGENT_GOVERNANCE.md` for full enforcement details.
