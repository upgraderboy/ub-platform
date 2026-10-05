/**
 * UB Platform: Master Design Tokens
 * Source of truth for Web and Mobile color palettes, typography, and glassmorphism.
 */

export const colors = {
  // Surface Layers (Dark Foundation)
  bg: {
    base: '#07090e',
    surface1: '#0d111a',
    surface2: '#141a27',
    surface3: '#1c2436',
  },
  // Brand Energy Accents
  accent: {
    cyan: '#00f0ff',
    cyanGlow: 'rgba(0, 240, 255, 0.25)',
    emerald: '#00ff9d',
    emeraldGlow: 'rgba(0, 255, 157, 0.25)',
    violet: '#a855f7',
    violetGlow: 'rgba(168, 85, 247, 0.25)',
  },
  // Typography
  text: {
    primary: '#f8fafc',
    secondary: '#94a3b8',
    muted: '#64748b',
    code: '#38bdf8',
  },
  // Hairline Borders & Glass
  glass: {
    borderSubtle: 'rgba(255, 255, 255, 0.07)',
    borderActive: 'rgba(0, 240, 255, 0.35)',
    surface: 'rgba(13, 17, 26, 0.7)',
    blur: '16px',
  },
} as const;

export const radii = {
  sm: '6px',
  md: '10px',
  lg: '16px',
  xl: '24px',
  full: '9999px',
} as const;

export const typography = {
  fonts: {
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    mono: 'JetBrains Mono, Fira Code, monospace',
  },
  scales: {
    hero: { size: '4rem', lineHeight: '1.1', weight: '800' },
    h1: { size: '2.5rem', lineHeight: '1.2', weight: '700' },
    h2: { size: '1.875rem', lineHeight: '1.3', weight: '600' },
    h3: { size: '1.25rem', lineHeight: '1.4', weight: '600' },
    bodyLarge: { size: '1.125rem', lineHeight: '1.6', weight: '400' },
    bodyRegular: { size: '1.0rem', lineHeight: '1.6', weight: '400' },
    caption: { size: '0.8125rem', lineHeight: '1.5', weight: '500' },
  },
} as const;
