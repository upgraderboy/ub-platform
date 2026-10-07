# 01: Project Status Tracker & Master Task Board

> **Last Updated:** 2026-10-06  
> **Current Phase:** Phase 2: Public Web Application Re-engineering (`apps/web`)  
> **Legend:** ⚪ Not Started | 🟡 In Planning / In Progress | 🟢 Implemented & Verified | 🔴 Blocked

---

## 📊 High-Level Phase Overview

| Phase | Description | Target Apps / Packages | Status |
| :--- | :--- | :--- | :--- |
| **Phase 0** | Documentation Suite & Agent Governance Setup | `docs/*`, `AGENTS.md` | 🟢 Implemented & Verified |
| **Phase 1** | Turborepo Monorepo & Core Packages Scaffolding | `turbo.json`, `packages/{types, ui, api}` | 🟢 Implemented & Verified |
| **Design Prototype** | Engaging Hero, Dual Mode (Dark/Light), Multi-Accent, Interactive Shell | `docs/verification/screenshots/` | 🟢 Approved & Verified |
| **Phase 2** | Public Web Application Re-engineering | `apps/web` (Next.js 15, ISR, Edge CDN) | 🟡 In Progress |
| **Phase 3** | Decoupled CMS Admin Portal | `apps/admin` (admin.upgraderboy.com) | ⚪ Not Started |
| **Phase 4** | Cross-Platform Mobile App | `apps/mobile` (React Native / Expo) | ⚪ Not Started |
| **Phase 5** | Data Curation, Migration & Seeding | DB Migration & Seed Scripts | ⚪ Not Started |
| **Phase 6** | End-to-End QA, Testing & Deployment | CI/CD, Lighthouse 100/100, Verification | ⚪ Not Started |

---

## 📋 Granular Task Matrix

### Phase 0: System Planning & Documentation Setup
- [x] Create `AGENTS.md` universal agent constitution (`🟢 Verified`)
- [x] Create `.agents/rules/governance.md` native Antigravity rules (`🟢 Verified`)
- [x] Create `docs/00_AGENT_GOVERNANCE.md` (`🟢 Verified`)
- [x] Create `docs/01_PROJECT_TRACKER.md` (`🟢 Verified`)
- [x] Create `docs/02_ARCHITECTURE.md` (`🟢 Verified`)
- [x] Create `docs/03_TECH_STACK_AND_DEPS.md` (`🟢 Verified`)
- [x] Create `docs/04_DESIGN_SYSTEM.md` (`🟢 Verified`)
- [x] Create `docs/05_ROUTES_AND_PAGES.md` (`🟢 Verified`)
- [x] Create `docs/06_DATA_MODELS_AND_SCHEMAS.md` (`🟢 Verified`)
- [x] Create `docs/07_DEPLOYMENT_AND_DEVOPS.md` (`🟢 Verified`)
- [x] Create `docs/08_ENVIRONMENT_AND_SECRETS.md` (`🟢 Verified`)
- [x] Create `docs/09_CONTENT_MIGRATION_AND_SEEDING.md` (`🟢 Verified`)
- [x] Create `docs/10_SECURITY_AND_ACCESS_CONTROL.md` (`🟢 Verified`)
- [x] Create `docs/11_MOBILE_SPEC_AND_OFFLINE_SYNC.md` (`🟢 Verified`)
- [x] Create `docs/12_TESTING_AND_QA_PLAYBOOK.md` (`🟢 Verified`)
- [x] Create `docs/13_MULTI_AGENT_TEAM_ROLES.md` (`🟢 Verified`)
- [x] Create `docs/verification/` proof directory (screenshots & recordings) (`🟢 Verified`)
- [x] Create `docs/decisions/ADR-001-monorepo-structure.md` (`🟢 Verified`)
- [x] Create `docs/decisions/ADR-002-decoupled-admin-app.md` (`🟢 Verified`)
- [x] Create root `README.md` (`🟢 Verified`)

### Phase 1: Turborepo Monorepo & Core Packages
- [x] Initialize Turborepo root (`turbo.json`, `package.json` with Bun workspaces) (`🟢 Verified: bun install in 2.3s, turbo 2.11.7`)
- [x] Configure `packages/config` (ESLint, Prettier, TypeScript, Tailwind presets) (`🟢 Verified: base TSConfig & Tailwind tokens`)
- [x] Build `packages/types` (Zod schemas for Project, Blog, Resource, Memory, Lead, SEO) (`🟢 Verified: tsc 0 errors, smoke tests passed`)
- [x] Build `packages/ui` (Design tokens, kinetic button, card, spotlight, glassmorphism) (`🟢 Verified: tokens.ts & tokens.css compiled`)
- [x] Build `packages/api` (Decoupled client layer for database queries and mutations) (`🟢 Verified: UbApiClient contract 0 errors`)
- [x] Setup in-project verification scripts in `scripts/` (`verify-all.sh`, `security-audit.sh`, `smoke-test.ts`) (`🟢 Verified: executable & passed`)
- [x] Design Prototype & Dual Theme System (`🟢 Approved & Verified`):
  - Hero Section (Portrait, live glass badges, SIH trophy, metrics, dual mode): [Dark Mode Proof](file:///Users/upgraderboy/Project%20with%20AI/UB%20Platform/docs/verification/screenshots/homepage-hero-dark-final.png) | [Light Mode Proof](file:///Users/upgraderboy/Project%20with%20AI/UB%20Platform/docs/verification/screenshots/homepage-hero-light-final.png)
  - Interactive Terminal, Services, Portfolio Filter, Community Hub, Contact: [Preview Artifact](file:///Users/upgraderboy/.gemini/antigravity-ide/brain/d6ed3ec1-bbeb-4420-bff0-d3666e1ad5c0/hero_and_theme_design_review.md)

### Phase 2: Public Web Application (`apps/web`)
- [x] Scaffold `apps/web` with Next.js 15 App Router (`🟢 Verified: Next.js 15.1.7, React 19, Turbopack, Tailwind v4`)
- [x] Implement kinetic Hero section with portrait, floating glass badges, live agency stats (`🟢 Verified`)
- [x] Implement Dual Theme (Dark/Light) & 5-Color Accent Palette Switcher (`🟢 Verified`)
- [x] Implement Upgrader Shell v3.0 (Interactive Developer Terminal with tab completion) (`🟢 Verified`)
- [x] Implement About Section & Core Values (Learn in Public, Technical Excellence, Mentorship) (`🟢 Verified`)
- [x] Implement Services Grid with animated hover glow & tech stacks (`🟢 Verified`)
- [x] Implement Portfolio Showcase with interactive category filtering (`🟢 Verified`)
- [x] Implement Community Hub with custom typed SVG social icons (`🟢 Verified`)
- [x] Implement Contact Section & Direct Agency Lead Intake Form (`🟢 Verified`)
- [x] Verification Proof Media:
  - [Next.js Homepage Dark Mode](file:///Users/upgraderboy/Project%20with%20AI/UB%20Platform/docs/verification/screenshots/nextjs-homepage-dark.png)
  - [Next.js Homepage Light Mode](file:///Users/upgraderboy/Project%20with%20AI/UB%20Platform/docs/verification/screenshots/nextjs-homepage-light.png)
  - [Next.js Interactive Terminal Section](file:///Users/upgraderboy/Project%20with%20AI/UB%20Platform/docs/verification/screenshots/nextjs-homepage-terminal.png)
- [x] Implement `Cmd+K` global command palette (`🟢 Verified: Live Modal & Search`)
- [x] Implement Chronological Milestone Timeline for `/projects` (`🟢 Verified: Featured, In Development, Monthly`)
- [x] Implement Modern Touch-First Search Capsule (Airbnb Floating Pill & Mobile Bottom Sheets) (`🟢 Verified`)
- [x] Export Viewport in Next.js RootLayout for native device scaling (`🟢 Verified`)
- [x] Responsive Mobile Navbar (h-16 sm:h-20) and non-colliding scroll headers (`🟢 Verified`)
- [x] Refined Desktop Island Capsule Navbar with compact `⌘K` shortcut button & single palette dropdown (`🟢 Verified`)
- [x] Theme Mode & Accent Palette Persistence Across Refresh (Zero Flash of Dark/Green) (`🟢 Verified`)
- [x] Implement `/blogs` feed & `/blogs/[slug]` rich reader with dynamic ToC (`🟢 Verified`)
  - Universal Batteries-Included `ModernSearchCapsule` (Multi-Scope Checkboxes, Airbnb Date Interval Range Picker, Dynamic Topics Rail)
  - Chronological Timeline Grouping by Month/Year (Jan 2025, Dec 2024, Nov 2024, Oct 2024)
  - Flagship Article Spotlight Hero Banner with live system metrics
  - 120 FPS Native CSS Scroll-Timeline Progress Bar (`animation-timeline: scroll()`) running on GPU compositor thread with continuous tracking
  - Floating Circular Reading HUD Ring with real-time remaining minutes & quick Scroll-To-Top
  - Interactive Reader Controls Toolbar (`BlogReaderToolbar`) with dynamic font sizing (`A-`, `A`, `A+`) & Zen Focus Mode
  - Interactive AI Voice Audio Dispatch Player with animated soundwave equalizer & speed controls
  - Reader Reaction Feedback Bar (Insightful 🔥, Brilliant 💡, Production Ready 🚀, Deep Tech 🧠)
- [x] Verification Proof Media:
  - [Next.js Homepage Dark Mode](file:///Users/upgraderboy/Project%20with%20AI/UB%20Platform/docs/verification/screenshots/nextjs-homepage-dark.png)
  - [Next.js Homepage Light Mode](file:///Users/upgraderboy/Project%20with%20AI/UB%20Platform/docs/verification/screenshots/nextjs-homepage-light.png)
  - [Refined Navbar Desktop Capsule & Theme Persistence](file:///Users/upgraderboy/Project%20with%20AI/UB%20Platform/docs/verification/screenshots/navbar-theme-persistence.png)
  - [Refined Mobile Header (375px)](file:///Users/upgraderboy/Project%20with%20AI/UB%20Platform/docs/verification/screenshots/navbar-mobile-header.png)
  - [Refined Mobile Drawer Menu](file:///Users/upgraderboy/Project%20with%20AI/UB%20Platform/docs/verification/screenshots/navbar-mobile-drawer.png)
  - [Technical Blogs Hub Index](file:///Users/upgraderboy/Project%20with%20AI/UB%20Platform/docs/verification/screenshots/blogs-hub-index.png)
  - [Technical Blog Reader Layout & ToC](file:///Users/upgraderboy/Project%20with%20AI/UB%20Platform/docs/verification/screenshots/blogs-reader-layout-toc.png)
  - [Technical Blog Reader Code Block Copy](file:///Users/upgraderboy/Project%20with%20AI/UB%20Platform/docs/verification/screenshots/blogs-reader-code-block.png)
  - [Command Palette Modal Opened](file:///Users/upgraderboy/Project%20with%20AI/UB%20Platform/docs/verification/screenshots/cmdk-modal-opened-proof.png)
  - [Projects Chronological Timeline](file:///Users/upgraderboy/Project%20with%20AI/UB%20Platform/docs/verification/screenshots/projects-timeline-overview.png)
  - [Multi-Field Search Checkboxes](file:///Users/upgraderboy/Project%20with%20AI/UB%20Platform/docs/verification/screenshots/search-fields-checkboxes.png)
  - [Quick Breakdown Modal](file:///Users/upgraderboy/Project%20with%20AI/UB%20Platform/docs/verification/screenshots/quick-breakdown-modal.png)
  - [Simplified Services Page](file:///Users/upgraderboy/Project%20with%20AI/UB%20Platform/docs/verification/screenshots/simplified-services-page.png)
- [x] Implement `/resources` hierarchical folder tree with permalinks & PDF preview (`🟢 Verified`)
  - 3 Interchangeable Views: **Drive Explorer Grid** (3D layered folder capsules with frosted tabs, dossier playbook cards with page curl corners and quick in-folder search), **Cards Grid** (editorial showcase with bound book spines, stitches, reading time, and direct link copy), and **Cyber Table Dossier** (`ResourceDriveListView` with format filter tabs, telemetry metrics, inline expandable drawers, and direct download buttons)
  - Interactive **3D Realistic Book Flip Reader** (`ResourceBookFlipReader`):
    - True dual-face 3D rotating leaf with perspective physics and dynamic light sweep
    - Synchronized two-stage Web Audio acoustic synthesis (paper lift & glide at 60ms, crisp landing snap at 360ms) in 100% lockstep with visual rotation
    - Interactive Index / Table of Contents page (Spread 1 / Page 1) with clickable topic cards that immediately flip to that target chapter
    - Header Table of Contents drawer for quick section jumping from any page
    - Multi-extension support across schemas and viewer: `.PDF`, `.DOCX`, `.TXT`, `.MD`, `.PPTX`, with explicit extension pills and format-aware raw inspector
    - Mobile-friendly single-page view mode with touch swipe gestures (swipe left/right to turn pages), responsive scaling, and thumb-friendly navigation bar
    - 3 Paper Themes: Obsidian (Dark), Vintage Parchment (Sepia), and Daylight Clean (Light)
    - Fullscreen edge-to-edge takeover mode toggle
  - Footer boundary protection (`min-h-[820px]` on resources section): prevents sidebar from ever overlapping the footer even when filtered results contain few or zero items
  - Sticky scroll **Knowledge Directory** sidebar residing completely outside `max-w-7xl` navbar-aligned width: starts naturally at the resources section and sticks smoothly at `top-24` on scroll
  - Independent scroll container (`sidebar-scroll-container` with `overscroll-contain`): scrolling the main resources leaves the sidebar in place, and user can independently scroll tall sidebar contents without moving the main page
  - Multi-component sidebar architecture: Knowledge Directory folder tree, Popular Topic Shortcuts (`#DSA`, `#Redis`, `#Next.js 15`...), Suggest a Playbook CTA card, and Curricula Live Sync index status
  - 100% navbar-aligned main resources canvas (`max-w-7xl`): Hero, Search Capsule, and full-width Drive Explorer / Cards / Table views without any middle crowding or overflow
  - Finder-style breadcrumbs bar with quick "Up one level" navigation and Root Drive shortcuts
  - Infinite Arbitrary Depth Recursive Subcategories (`apps/web/src/data/categoryUtils.ts`):
    - Recursive TreeNode folder sidebar with nested guide lines and descendant active states
    - Horizontal scrollable breadcrumb rail (`Root > Cat > SubCat > DeepSubCat`) with direct jump buttons that never overflows or wraps
    - Recursive document count aggregation across all descendant folders
    - In-folder live search filtering both directories and documents simultaneously
    - Responsive multi-column grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`) handling 1 to 50+ subdirectories without layout distortion
  - 7 genuine curated study materials and playbooks (Visual DSA, SIH 2024 Blueprint, Redis System Design, Next.js 15 Monorepos, DBMS Optimization, Web Security Matrix)
- [x] Implement `/memories` The Visual Life Album & Personal Odyssey (`🟢 Verified`)
  - **Signature Modern Capsule Search Bar Integration**:
    - Floating glassmorphism search capsule with multi-field search scoping (`title`, `tags/locations`, `description`, `category`)
    - Interactive Date Range filtering popover with Airbnb-style dual month picker and reset controls
    - Real-time instant count badge and domain category filter dropdown
  - **Visitor Mood & Emotional Energy Engine**:
    - Interactive mood wavelength selection: `✨ All Vibes`, `🏆 Winning Moments`, `⚡ Late Night Energy`, `☕ Nostalgic Roots`, `💡 Spotlight & Talks`
    - Dynamic ambient background glow and typography gradients reacting in real-time to active visitor mood
    - Gentle analog audio atmosphere toggle (Web Audio API synthesized lo-fi tape/projector hum)
    - Authentic mood badges tagged across all cards
  - **3 Master Showcase Perspectives**:
    - **📸 Aesthetic Polaroid Scrapbook Wall**:
      - Vintage washi tape pins in 5 pastel patterns
      - Subtle natural tilt rotations (-2° to +2°) that smoothly level out on hover
      - Glossy light reflection sheen glide effect on card hover
      - Authentic retro orange date stamps (`'24 12 22`), photo count badges (`📸 4 photos`), and mood sticker pins
    - **⚡ The Illuminated Chronicle Path**:
      - Central glowing vertical neon conduit with animated pulses
      - Glowing milestone nodes grouped by epoch (`EPOCH 2025`, `EPOCH 2024`)
      - Alternating floating cinematic glassmorphism story cards with mood edge illumination
    - **🖼️ Google Photos Chronological Moments Stream**:
      - Unbundled individual photo tiles grouped strictly chronologically descending by Month & Year (April 2025, January 2025, December 2024, etc., latest first)
      - Sticky month glass headers with calendar icon, month title, and photo count badge
      - Layout density switcher: `Comfortable` (3-4 cols) vs `Compact` (4-6 dense gallery cols)
      - Quick month jump scrubber bar and direct click-to-lightbox navigation
  - **Cinematic Ambient Photo Lightbox** (`MemoryDossierModal`):
    - Ambient blurred photo halo expanding dynamically behind the modal
    - Crisp high-resolution center photo canvas with smooth carousel and thumbnail strip
    - Engaging personal life stories (no dry technical jargon or debug reports)
    - Interactive cheer reaction counters (`❤️ Love`, `🔥 Fire`, `✨ Vibe`)
    - Full keyboard arrow and Escape key support
  - **Supercharged Modern Search Capsule (`ModernSearchCapsule`)**:
    - **Native Voice Search (`Mic` button)**: Integrated Web Speech Recognition API with real-time listening banner and auto-transcription into search query.
    - **Instant Suggestions, History & Saved Presets Tabs**: Raycast/Linear-style omnibox dropdown with Trending discoveries, local search history with 1-click restore/clear, and custom Bookmarkable Saved Views (`ub_capsule_saved_presets`).
    - **Raycast/Linear Keyboard Navigation**: Full `ArrowDown` & `ArrowUp` selection cycling, `Enter` to apply, `Tab` to autocomplete, and `Esc` to close with visual keyboard hints legend (`[↑↓ Navigate] [↵ Apply] [Tab Fill] [Esc Close]`).
    - **Power Search Syntax Support & Cheat Sheet**: Interactive quick-reference popup for `⌘K`, `/`, `"exact phrase"`, and field scoping.
    - **Interactive Active Filter Breadcrumbs Rail**: Real-time dismissible glass badges for query, category, date range, scoped fields, and sort mode with 1-click individual removal and `Save View` / `Reset All` controls.
    - **Synthesized Tactile Audio Cues (Web Audio API)**: Zero-latency subtle 10ms acoustic micro-clicks for filter toggling, voice activation, and resets with persistent Mute/Audio On toggle (`Volume2` / `VolumeX`).
    - **Deep-Link Share & Markdown Summary Export**: One-click URL generator with query parameters and instant markdown summary copier to clipboard.
    - **Sort Matrix Segment & Quick Preset Date Chips**: 4-segment floating pill with sort options (`Newest`, `Oldest`, `Milestones`, `A-Z`) and quick preset chips (`📅 2025`, `📅 2024`, `⏱️ 30 Days`).
    - **Verified Across All Platform Routes**: Fully backward-compatible across `/memories`, `/resources`, `/blogs`, and `/projects`.
  - Multi-category cross-tagging support (`categories: ['hackathons', 'college', 'milestones']`)
  - Verified browser recording: `polaroid_chronicle_preview_1791369010342.webp`
- [x] Implement `/contact` dedicated consultation booking page (`🟢 Verified`)
  - **Track 1: Interactive Strategy Call Scheduler (`ConsultationBookingCalendar`)**:
    - Topic selection: Web Architecture, Mobile Apps, AI Workflows, Code Review
    - Duration format: 15-min Discovery Chat vs 45-min Deep-Dive Strategy
    - Horizontal date picker swiper & time slot matrix with multi-timezone switcher (`IST`, `UTC`, `EST`, `PST`, `CET`)
    - Client details intake (Name, Email, WhatsApp, Brief)
    - Google Calendar 1-click URL generator, downloadable `.ics` file, and direct WhatsApp sync to Ankit Bhuria
  - **Track 2: Interactive Project Scope Estimator (`ProjectScopeEstimator`)**:
    - Real-time technical scope calculation, weeks delivery estimate, and currency toggle (`₹ INR` / `$ USD`)
    - Architecture platform selection and add-on checklist (Auth RBAC, AI Agents, Payments, Docker CI/CD, Enterprise SEO)
    - Direct API route `/api/lead` backed by strict `LeadSchema` validation from `packages/types`
  - **Agency SLA & Trust Matrix**: 4-hour response SLA, mutual NDA upfront, SIH 2024 trophy, and 30-day post-launch warranty
  - **Agency Physical HQ & Founder Contact Card**: Near Toll Tax, Sikar Road, Jhunjhunu, Rajasthan with direct phone/WhatsApp (+91 91662 71496) and FAQ section
- [x] Implement Google Sitelinks Searchbox & Rich Structured Data (`🟢 Verified`)
  - **Root Metadata Title & Description**: Match exact branding `Upgrader Boy - Portfolio, Blogs, Projects` and `Tech. That Makes Trends`
  - **Google Sitelinks Searchbox (`schema.org/WebSite` + `SearchAction`)**: Enables Google site-specific search box in SERP results
  - **Google Sitelinks Hierarchy (`SiteNavigationElement` + `ItemList`)**: Structured data for sub-routes (`/blogs`, `/projects`, `/memories`, `/resources`) with exact title and description pairs
  - **Dynamic Next.js XML Sitemap (`sitemap.ts`)**: Auto-generated priority routes with daily/weekly change frequencies
  - **Search Crawler Directives (`robots.ts`)**: Universal allow with Googlebot support and sitemap index linkage
- [ ] Implement `/tools` developer micro-utilities playground

### Phase 3: Decoupled CMS Admin Portal (`apps/admin`)
- [ ] Scaffold `apps/admin` (independent deployment)
- [ ] Implement secure authentication & session management
- [ ] Implement Dashboard overview & lead inquiry manager
- [ ] Implement Blog Post rich block editor
- [ ] Implement Project & Case Study manager
- [ ] Implement Visual Resource Category Tree & PDF catalog manager
- [ ] Implement Memories photo uploader & tagger
- [ ] Implement SEO metadata & Terminal commands manager

### Phase 4: React Native Mobile App (`apps/mobile`)
- [ ] Scaffold Expo SDK 52+ app with Expo Router
- [ ] Implement bottom tab navigation (Home, Blogs, Resources, Projects, Profile)
- [ ] Implement offline caching for resources and blogs
- [ ] Integrate shared design tokens from `packages/ui`
- [ ] Implement push notifications infrastructure

### Phase 5: Content Migration & Quality Seeding
- [x] Migrate genuine assets (DSA Notes, DBMS Notes, Resume PDF, Founder Portrait) (`🟢 Verified`)
  - Curated and bundled into `apps/web/public/assets/`: `Ankit Bhuria.jpeg`, `ankit-bhuria.jpeg`, `UB-Resume.pdf`, `Bhuria.png`, `UB.png`, `AB.png`, `upgraderboy_dark.svg`
  - Fixed hero section portrait rendering and direct download resume button linking locally and on production domain
  - Verified HTTP 200 image and PDF serving via Next.js
- [ ] Migrate and elevate authentic milestone memories (SIH Hackathon, MERN Meetup)
- [ ] Migrate and elevate technical blogs with professional copywriting
- [ ] Discard all placeholder/dummy content

### Phase 6: QA, Performance & Production Launch
- [x] Configure Automated CI/CD Pipeline (`.github/workflows/ci.yml`) (`🟢 Verified`)
  - Enforces `bun install --frozen-lockfile`, `turbo run check`, `turbo run lint`, `bun test`, `smoke-test.ts`, and `turbo run build`
  - Automated concurrency grouping and PR preview testing
- [x] Configure Monorepo Hosting Architecture (`apps/web/vercel.json`) (`🟢 Verified`)
  - Edge CDN & ISR caching configuration for `upgraderboy.com`
  - Production compilation verified (`turbo run build` compiled Next.js 16/Turbopack with 0 errors)
- [ ] Run browser subagent end-to-end user journey tests
- [ ] Benchmark Core Web Vitals (Target: 95+ Mobile, 100 Desktop)
- [ ] Deploy `apps/web` to `upgraderboy.com` & `apps/admin` to `admin.upgraderboy.com`
