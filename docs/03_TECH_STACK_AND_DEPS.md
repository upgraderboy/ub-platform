# 03: Technology Stack & Dependencies Specification

This document records the exact technology stack, libraries, and tools chosen for the **UB Platform**, along with the architectural justification for each.

---

## 1. Core Platform & Tooling

| Technology | Purpose | Justification |
| :--- | :--- | :--- |
| **Turborepo** | Monorepo Orchestration | High-velocity build pipeline with intelligent remote caching and task orchestration across Web, Admin, and Mobile. |
| **pnpm** | Package Manager | Fast, deterministic, space-efficient symlink-based package management ideal for monorepos. |
| **TypeScript 5.x** | Language | Strict end-to-end type safety across the entire repository. Banned: `any` and `@ts-ignore`. |
| **Zod** | Schema Validation | Runtime data validation and TypeScript type inference. Guarantees that no invalid payload enters the system. |

---

## 2. Public Web Application (`apps/web`)

| Package | Purpose | Justification |
| :--- | :--- | :--- |
| **Next.js 15 (App Router)** | Web Framework | Server-side rendering, ISR caching, Edge routes, and optimal SEO indexing for blogs, case studies, and study materials. |
| **Tailwind CSS + Tokens** | Styling | Rapid utility-first styling bound directly to our centralized design tokens in `packages/ui`. |
| **Framer Motion** | Motion & Animation | Smooth micro-animations, layout transitions, spotlight card tracking, and kinetic hero visuals. |
| **Lucide React** | Icons | Clean, modern, lightweight SVG icons with consistent stroke widths. |
| **Shiki / Prism** | Syntax Highlighting | High-performance code block highlighting for blog posts and technical case studies. |

---

## 3. Dedicated CMS Admin Portal (`apps/admin`)

| Package | Purpose | Justification |
| :--- | :--- | :--- |
| **Next.js 15 / React 19** | CMS Portal | Separate build & deployment pipeline isolated from public web. |
| **TanStack Table** | Data Grids | Virtualized, high-performance table management for leads, blogs, and resources. |
| **TipTap / BlockNote** | Rich Text Editor | Modern Notion-style block editor for authoring rich technical blog posts with code, callouts, and image embeds. |

---

## 4. Mobile Application (`apps/mobile`)

| Package | Purpose | Justification |
| :--- | :--- | :--- |
| **Expo (SDK 52+)** | Mobile Framework | Modern, universal React Native toolchain with managed native modules and OTA updates. |
| **Expo Router** | Native Navigation | File-system-based routing matching Next.js conventions, native tabs, and deep-linking support (`upgraderboy://...`). |
| **React Native Reanimated** | Mobile Animation | 60-120 FPS native thread animations for smooth gesture-driven UI. |
| **react-native-mmkv** | Offline Storage | Blazing fast key-value storage for offline caching of blogs, notes, and user preferences. |

---

## 5. Shared Core Packages (`packages/*`)

* `packages/types`: Pure TypeScript interfaces & Zod schemas. Zero heavy dependencies.
* `packages/ui`: Shared design tokens (colors, gradients, typography, radii) and reusable UI primitives.
* `packages/api`: Headless data client wrapping database queries, mutations, and error handling.
* `packages/utils`: Pure helper functions (reading time calculator, slugifier, date formatters).
