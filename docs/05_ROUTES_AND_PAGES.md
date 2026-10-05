# 05: Route Catalog & User Flow Specification

This document details every screen, dynamic route, component tree, and user flow across the **Public Web App (`apps/web`)** and the **CMS Admin Portal (`apps/admin`)**.

---

## 1. Public Web Application (`apps/web`)

```text
/                              -> Homepage & Brand Hub
/services                      -> Business offerings & Project Estimator
/projects                      -> Filterable projects showcase
/projects/[slug]               -> Dedicated deep-dive case study
/blogs                         -> Technical blog feed
/blogs/[slug]                  -> Rich reader with dynamic ToC
/resources                     -> Hierarchical study material catalog
/resources/[...category]       -> Shareable category folder permalinks
/memories                      -> Visual journey & milestone timeline
/tools                         -> Developer micro-utilities
/contact                       -> Direct contact & interactive lead wizard
/track                         -> Client project milestone tracker
```

### Detailed Screen Breakdown:

#### 1. `/` (Homepage & Brand Hub)
* **Hero Section:** Animated name/headline, Learn in Public badge, direct CTA buttons ("Say Hello", "View Case Studies"), and social matrix.
* **Security Console / Terminal:** Embedded interactive Upgrader Shell v3.0 supporting commands (`help`, `about`, `skills`, `projects`, `blogs`, `contact`, `clear`, `matrix`, `curl ub.sh`).
* **About & Value Proposition:** Professional bio, years of experience counter, completed projects counter, and downloadable resume (`UB-Resume.pdf`).
* **Skills Matrix:** Visual badges grouped by domain (Frontend, Backend, Mobile, DevOps/Cloud).
* **Featured Projects Showcase:** Curated selection of top projects with live links.
* **Client Testimonials:** Verified reviews carousel.

#### 2. `/services` (Business Offerings Hub)
* **Service Tiers:** Full-Stack Web Apps (Next.js/MERN), Cross-Platform Mobile (React Native/Expo), Custom CMS & Cloud Architectures.
* **Deliverables & FAQ:** Turnaround times, code quality guarantees, maintenance options.
* **Interactive Scope & Budget Estimator:** Multi-step wizard allowing prospective clients to calculate project scope and submit a detailed brief.

#### 3. `/projects` & `/projects/[slug]` (Case Studies)
* **Index (`/projects`):** Filter by category (Web, Mobile, Open Source), live search, tech stack tags.
* **Case Study (`/projects/[slug]`):**
  * Hero cover & live demo / GitHub action buttons.
  * Executive Summary & Problem Statement.
  * Architecture & System Design diagrams.
  * Key Engineering Challenges & Solutions.
  * Metrics / Results achieved.

#### 4. `/blogs` & `/blogs/[slug]` (Publishing Hub)
* **Index (`/blogs`):** Search by keyword, tag filters, estimated reading times.
* **Reader (`/blogs/[slug]`):**
  * Sticky auto-scrolling Table of Contents (ToC).
  * Syntax-highlighted code blocks with "Copy Code" button.
  * Estimated read time and published date.
  * Social sharing buttons (X/Twitter, LinkedIn, WhatsApp).

#### 5. `/resources` & `/resources/[...category]` (Study Materials)
* **Interactive Folder Tree:** Nested categories (e.g. `B.Tech -> CS -> Books -> AI & ML`).
* **Permalinks:** Direct URL matching folder hierarchy so students can share exact folders.
* **Document Viewer:** Embedded PDF reader modal with direct download link, file size, and author source.

#### 6. `/memories` (Visual Journey Timeline)
* **Filter Tabs:** All, Hackathons, Meetups, Internships, Milestones.
* **Masonry Grid:** Photo galleries with animated lightbox zoom, event date, and storytelling captions.

#### 7. `/tools` (Developer Utilities)
* In-browser tools: JSON to TypeScript converter, CSS Glassmorphism generator, Regex tester.

---

## 2. Dedicated CMS Admin Portal (`apps/admin`)

* **`/login`:** Secure authentication with rate limiting.
* **`/dashboard`:** Overview metrics (page views, new leads, system health).
* **`/admin/blogs`:** Rich block-based markdown editor (create, edit, publish, draft).
* **`/admin/projects`:** Case study publisher with architecture upload and tag manager.
* **`/admin/resources`:** Visual drag-and-drop category tree builder and PDF file uploader.
* **`/admin/memories`:** Event photo uploader and milestone manager.
* **`/admin/leads`:** Review incoming proposals from the project budget estimator.
* **`/admin/settings`:** SEO sitelinks manager, terminal command editor, and credential management.
