# ADR-001: Adoption of Turborepo Monorepo Architecture

* **Status:** Accepted
* **Date:** 2026-10-06
* **Deciders:** Upgrader Boy Lead Engineering

---

## Context & Problem Statement
The legacy `upgraderboy.com` platform was a single Next.js web application. As the business expands to include a dedicated cross-platform mobile app (React Native / Expo) and an isolated CMS admin dashboard, maintaining separate repositories would lead to massive duplication of TypeScript types, data fetching logic, and styling tokens.

## Decision
Adopt **Turborepo** with **pnpm workspaces** as the monorepo orchestration tool with the following structure:
* `apps/web`: Public website (Next.js 15).
* `apps/admin`: Isolated CMS portal.
* `apps/mobile`: Cross-platform mobile app (Expo / React Native).
* `packages/types`: Shared Zod schemas and TypeScript models.
* `packages/ui`: Shared design tokens, primitives, and kinetic styling.
* `packages/api`: Headless data client for database queries and mutations.

## Consequences & Trade-offs
* **Positive:** Zero duplication of business logic, 100% type safety across Web and Mobile, high-speed remote task caching.
* **Negative:** Slightly higher initial setup complexity compared to a standalone web project. Mitigated by standardized tooling and shared configs.
