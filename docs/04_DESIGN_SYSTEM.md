# 04: Design System & Visual Specification

This document defines the official visual design language, color tokens, typography scales, glassmorphism formulas, and animation conventions for the **UB Platform**.

---

## 1. Aesthetic Direction: Kinetic Cyber-Modern
The brand identity of **Upgrader Boy** balances **deep tech credibility** with **modern luxury aesthetics**.
* **Visual Tone:** High-contrast dark mode foundation with subtle atmospheric glow accents (Electric Cyan, Emerald Matrix, Cyber Violet).
* **Atmospheric Polish:** Layered glassmorphism (`backdrop-filter`), hairline glowing borders, radial gradient meshes, and subtle noise textures.
* **Typography:** Modern clean sans-serif paired with crisp monospace accents for developer credibility.

---

## 2. Color Tokens Palette

```css
:root {
  /* Surface Layers (Dark Foundation) */
  --bg-base: #07090e;           /* Deep space void */
  --bg-surface-1: #0d111a;      /* Primary container surface */
  --bg-surface-2: #141a27;      /* Secondary surface / card background */
  --bg-surface-3: #1c2436;      /* Hover states & active surfaces */

  /* Brand Accent Colors */
  --accent-cyan: #00f0ff;        /* Primary energy accent (Cyber Cyan) */
  --accent-cyan-glow: rgba(0, 240, 255, 0.25);
  --accent-emerald: #00ff9d;     /* Success, terminal, verified badge */
  --accent-emerald-glow: rgba(0, 255, 157, 0.25);
  --accent-violet: #a855f7;      /* Creative, case studies, AI accents */
  --accent-violet-glow: rgba(168, 85, 247, 0.25);

  /* Text & Foreground */
  --text-primary: #f8fafc;       /* Highest contrast headers (98% white) */
  --text-secondary: #94a3b8;     /* Body copy, descriptions (slate-400) */
  --text-muted: #64748b;         /* Metadata, dates, breadcrumbs (slate-500) */
  --text-code: #38bdf8;          /* Monospace code tokens */

  /* Glassmorphism & Hairline Borders */
  --border-subtle: rgba(255, 255, 255, 0.07);
  --border-active: rgba(0, 240, 255, 0.35);
  --glass-surface: rgba(13, 17, 26, 0.7);
  --glass-blur: blur(16px);
}
```

---

## 3. Typography Hierarchy

* **Heading Font:** Inter / Outfit / Cabinet Grotesk (geometric, sleek, modern).
* **Body Font:** Inter (maximum readability across high-DPI screens and mobile).
* **Monospace Font:** JetBrains Mono / Fira Code (used for code snippets, Terminal Console, and technical metrics).

| Scale | Desktop Size | Mobile Size | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Hero Display** | 4.0rem (64px) | 2.5rem (40px) | Bold 800 | Homepage Hero headline |
| **Heading 1** | 2.5rem (40px) | 2.0rem (32px) | Bold 700 | Page titles (`/projects`, `/blogs`) |
| **Heading 2** | 1.875rem (30px) | 1.5rem (24px) | SemiBold 600 | Section headers |
| **Heading 3** | 1.25rem (20px) | 1.125rem (18px) | SemiBold 600 | Card titles, modal headers |
| **Body Large** | 1.125rem (18px) | 1.0rem (16px) | Regular 400 | Lead paragraphs |
| **Body Regular** | 1.0rem (16px) | 0.875rem (14px) | Regular 400 | Standard content copy |
| **Caption / Meta** | 0.8125rem (13px) | 0.75rem (12px) | Medium 500 | Tags, timestamps, reading time |

---

## 4. UI Components & Micro-Interactions

### A. The Kinetic Glass Card
```css
.ub-card {
  background: var(--glass-surface);
  backdrop-filter: var(--glass-blur);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.ub-card:hover {
  border-color: var(--border-active);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px -8px var(--accent-cyan-glow);
}
```

### B. Mouse Spotlight Tracking
Cards on the web track mouse position with a dynamic radial gradient overlay:
`background: radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(0, 240, 255, 0.08), transparent 40%)`.

### C. Upgrader Shell (Terminal Styling)
* Background: `#080b11` with 90% opacity.
* Accent: `#00ff9d` (Matrix Emerald prompt: `upgrader@boy:~$`).
* Scanline effect with smooth auto-scroll.
