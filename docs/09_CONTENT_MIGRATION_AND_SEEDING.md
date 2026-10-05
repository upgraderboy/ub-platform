# 09: Content Migration & Quality Seeding Playbook

This document details the migration plan for genuine assets from the legacy `upgraderboy.com` site, the filtering rules for discarding test data, and the professional copywriting upgrades.

---

## 1. Data Curation Strategy (Zero Dummy Data)

### ❌ Discarded from Old Site:
* Placeholders with empty demo/GitHub links.
* Generic test descriptions (*"This is short description. But now it is not short..."*).
* Empty client testimonial blocks (*"No testimonials available yet"*).
* Unsplash filler photos not representing real milestones.

### ✅ Preserved Genuine Assets:
1. **Academic Study Materials:**
   * DSA Notes (109 pages) PDF (`https://raw.githubusercontent.com/upgraderboy/Portfolio-PDF-Assets/main/DSANotes%20109%20pages.pdf`).
   * DBMS Complete Review Notes.
   * Multi-level B.Tech and GATE CS category hierarchy.
2. **Authentic Milestones & Memories:**
   * **Smart India Hackathon:** 1st Prize Winner, national-level 36-hour hackathon.
   * **MERN Stack Developer Meetup:** Technical talk delivered on high-performance React architectures.
   * **Frontend Web Developer Internship:** Real-world enterprise product delivery.
3. **Official Bio & Credentials:**
   * CV Resume PDF (`/assets/UB-Resume.pdf`).
   * Verified handles: LinkedIn (`upgraderboy`), Instagram (`@upgraderboy`), X/Twitter (`@upgraderboy`), Hashnode (`upgraderboy.hashnode.dev`).

---

## 2. Professional Copywriting Transformations

| Domain | Legacy Website Copy | Upgraded 2.0 Agency Copy |
| :--- | :--- | :--- |
| **Headline** | *"Full Stack Developer using MERN and Next.js, I create web apps with UI / UX user interface and make robust backend applications..."* | **"Engineering high-velocity web platforms and cross-platform mobile ecosystems. Specializing in Next.js, React Native, and resilient distributed architectures that bridge human-centric design with raw backend performance."** |
| **Experience Badge** | *"Service with more than 3 years of experience. Providing quality work to clients and companies."* | **"3+ Years of Commercial Engineering. Architecting production systems, high-traffic APIs, and enterprise web solutions."** |
| **Services Summary** | *"MERN enthusiast, crafting robust apps. Versatile in native apps."* | **"End-to-End Product Engineering: From distributed backend systems and real-time APIs to pixel-perfect, 120 FPS native mobile applications."** |

---

## 3. Seed Data Schemas (`packages/api/seed/`)

During Phase 5 of the roadmap, automated migration scripts will seed the database with:
* `seed-categories.json`: Full nested folder tree for B.Tech & GATE CS.
* `seed-resources.json`: DSA & DBMS study documents with direct PDF links and thumbnails.
* `seed-memories.json`: Curated milestones with real event photography.
* `seed-terminal.json`: Built-in commands (`help`, `about`, `skills`, `projects`, `blogs`, `contact`, `clear`, `matrix`).
