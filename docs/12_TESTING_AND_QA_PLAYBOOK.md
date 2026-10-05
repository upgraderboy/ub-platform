# 12: Testing, Verification & Quality Assurance Playbook

This document defines the automated verification commands, manual pre-flight checklists, and performance benchmarks required before any feature or release is marked complete.

---

## 1. Automated Verification Commands (Bun)

Before marking any task as `🟢 Implemented & Verified` in [`01_PROJECT_TRACKER.md`](01_PROJECT_TRACKER.md), run:

```bash
# 1. Full monorepo typecheck (Zero TypeScript errors)
bun x turbo run check

# 2. Strict linting across Web, Admin, Mobile, and Packages
bun x turbo run lint

# 3. Unit, schema validation & functional tests
bun test

# 4. Production build check (Zero bundle errors)
bun x turbo run build
```

---

## 2. In-Project Verification & Security Scripts (`scripts/`)

The repository includes standalone executable test scripts that can be invoked with Bun:

```bash
# Complete sanity pipeline (Typecheck, Lint, Tests, Build)
bun run verify            # executes scripts/verify-all.sh

# Security & Secret Leak Scanner
bun run audit:security    # executes scripts/security-audit.sh

# Functional Smoke Test (HTTP 200 checks, Zod payload verification)
bun run test:smoke        # executes scripts/smoke-test.ts
```

---

## 3. Mandatory Proof Collection Protocol (Visual Evidence)

For any user-facing feature or interactive component:
1. **Screen Recording (`.webp` / `.mp4`):** Record the feature working interactively (e.g. running terminal commands, navigating folder trees, opening modals).
2. **Screenshots (`.png`):** Capture high-res desktop and mobile viewport states.
3. **Storage Location:** Save files directly in `docs/verification/screenshots/` or `docs/verification/recordings/`.
4. **Permanent Reference in Tracker:** Link the media path in `docs/01_PROJECT_TRACKER.md` so future developers can inspect how the feature was verified at that exact point in time.

---

## 2. Performance & Web Vitals Benchmarks

The public website (`apps/web`) must meet these target benchmarks on Google Lighthouse / PageSpeed:

| Metric | Target (Desktop) | Target (Mobile) |
| :--- | :--- | :--- |
| **Performance Score** | 98 - 100 | 90 - 95+ |
| **Largest Contentful Paint (LCP)** | < 1.2s | < 2.0s |
| **First Input Delay / INP** | < 50ms | < 100ms |
| **Cumulative Layout Shift (CLS)** | 0.00 | < 0.05 |
| **Accessibility & SEO** | 100 | 100 |

---

## 3. Manual Pre-Deployment Checklist

1. [ ] **Responsive Check:** Test on 320px (iPhone SE), 390px (iPhone 14/15), 768px (iPad), and 1440px+ (Desktop).
2. [ ] **Terminal Console:** Test commands (`help`, `about`, `skills`, `projects`, `blogs`, `contact`, `clear`, `matrix`).
3. [ ] **Project Estimator:** Submit a test lead in the multi-step calculator and verify delivery.
4. [ ] **PDF Reader:** Verify embedded preview and direct download of DSA/DBMS notes.
5. [ ] **Blog Reader:** Check sticky Table of Contents tracking and code block copy button.
6. [ ] **Fault Isolation:** Intentionally take down or halt the admin backend; verify that `apps/web` continues loading cached pages smoothly without a white screen.
