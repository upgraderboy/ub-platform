# 07: Deployment, Hosting & DevOps Architecture

This document specifies the deployment infrastructure, domain routing, CDN caching strategy, and CI/CD pipelines for the **UB Platform**.

---

## 1. Domain & Routing Topology

| Domain | Application | Hosting Provider | Deployment Strategy |
| :--- | :--- | :--- | :--- |
| **`upgraderboy.com`** | `apps/web` | Vercel / Cloudflare Pages | ISR (Incremental Static Regeneration) on Edge CDN. |
| **`admin.upgraderboy.com`** | `apps/admin` | Dedicated Vercel / Cloudflare project | Private SPA / Serverless Dashboard isolated from public web. |
| **`api.upgraderboy.com`** | Shared API / Workers | Edge Serverless / Cloudflare Workers | REST / Serverless endpoints. |
| **Mobile App** | `apps/mobile` | Apple App Store & Google Play | Managed Expo EAS Builds & OTA updates. |

---

## 2. Edge CDN & Caching Strategy (ISR)

* **Public Web (`apps/web`):**
  * Landing page (`/`), blogs (`/blogs`), case studies (`/projects`), and study materials (`/resources`) are compiled statically.
  * Revalidation period: `revalidate = 3600` (1 hour) or triggered on-demand via webhook when the Admin CMS updates content.
  * **Zero-Downtime Guarantee:** If the database experiences network latency or downtime, the Edge CDN continues serving cached pages with 100% uptime.

---

## 3. CI/CD Pipeline (GitHub Actions)

On every Git push or Pull Request, the CI pipeline executes:
1. **Lint & Format Check:** `turbo run lint` across all apps and packages.
2. **Typecheck:** `turbo run typecheck` enforcing strict TypeScript validation.
3. **Build Validation:** `turbo run build` verifying clean production bundles.
4. **Automated Preview Deploys:** Vercel / Cloudflare generates isolated staging URLs for testing before merging to `main`.
