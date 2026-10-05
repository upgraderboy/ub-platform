# UB Platform (Upgrader Boy)

> **Next-Generation Tech Showcase, Agency Engine & Mobile Ecosystem**  
> Scalable, fault-isolated Turborepo monorepo uniting Web (`upgraderboy.com`), Admin (`admin.upgraderboy.com`), and Mobile (React Native / Expo).

---

## ⚡ Quick Start for Developers & AI Agents

Before writing code or running commands, **all developers and AI agents must read:**
1. **[AGENTS.md](AGENTS.md)** — Core behavioral laws, fault-isolation rules, and anti-shortcut standards.
2. **[01_PROJECT_TRACKER.md](docs/01_PROJECT_TRACKER.md)** — Active phase, task status matrix, and progress.
3. **[02_ARCHITECTURE.md](docs/02_ARCHITECTURE.md)** — Monorepo topology and blast-radius containment.

---

## 🏗️ Monorepo Topology

```text
UB Platform/
├── apps/
│   ├── web/                    # Next.js 15 (Edge CDN, ISR, kinetic UI) -> upgraderboy.com
│   ├── admin/                  # Isolated CMS Portal -> admin.upgraderboy.com
│   └── mobile/                 # React Native / Expo Router (iOS & Android)
│
├── packages/
│   ├── types/                  # Zod schemas & TypeScript types (Single source of truth)
│   ├── ui/                     # Design tokens, primitives, kinetic components
│   ├── api/                    # Headless data client for queries & mutations
│   ├── config/                 # Shared ESLint, Prettier, Tailwind, TSConfig
│   └── utils/                  # Shared helper functions
│
└── docs/                       # Complete 12-module living documentation suite
```

---

## 📖 Master Documentation Index

| Doc | Topic | Description |
| :--- | :--- | :--- |
| **[00: Governance](docs/00_AGENT_GOVERNANCE.md)** | AI Agent Protocol | Pre-flight checklists and alignment warnings. |
| **[01: Tracker](docs/01_PROJECT_TRACKER.md)** | Status Board | Master living task matrix with verification states. |
| **[02: Architecture](docs/02_ARCHITECTURE.md)** | System Design | Fault isolation, zero-downtime, and package boundaries. |
| **[03: Tech Stack](docs/03_TECH_STACK_AND_DEPS.md)** | Dependencies | Tools, packages, versions, and justifications. |
| **[04: Design System](docs/04_DESIGN_SYSTEM.md)** | Visual Identity | Tokens, glassmorphism, typography, and micro-interactions. |
| **[05: Routes & Pages](docs/05_ROUTES_AND_PAGES.md)** | Screen Catalog | Breakdown of all web and admin routes. |
| **[06: Data Models](docs/06_DATA_MODELS_AND_SCHEMAS.md)** | Zod Schemas | Typed data contracts for blogs, projects, resources, leads. |
| **[07: DevOps](docs/07_DEPLOYMENT_AND_DEVOPS.md)** | Hosting & CI/CD | Domains, CDN caching, and automated deployment pipelines. |
| **[08: Secrets](docs/08_ENVIRONMENT_AND_SECRETS.md)** | Environment | Public vs. private `.env` classification. |
| **[09: Migration](docs/09_CONTENT_MIGRATION_AND_SEEDING.md)** | Data Curation | Legacy data preservation and copywriting upgrades. |
| **[10: Security](docs/10_SECURITY_AND_ACCESS_CONTROL.md)** | Hardening | RLS database rules, XSS prevention, rate limiting. |
| **[11: Mobile](docs/11_MOBILE_SPEC_AND_OFFLINE_SYNC.md)** | React Native | Expo tabs, offline caching (`MMKV`), and native UX. |
| **[12: QA Playbook](docs/12_TESTING_AND_QA_PLAYBOOK.md)** | Verification | Test commands, Lighthouse targets, and release checklists. |
| **[Decisions](docs/decisions/)** | ADRs | Architecture Decision Records. |
