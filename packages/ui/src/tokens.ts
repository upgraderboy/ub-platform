/**
 * UB Platform: Master Design Tokens
 * Source of truth for Web and Mobile color palettes, typography, and glassmorphism.
 * Supports both Light and Dark modes with dynamic accent switching.
 */

export const accents = {
  green: {
    name: 'Neon Green',
    color: '#00FF1E',
    glow: 'rgba(0, 255, 30, 0.25)',
    border: 'rgba(0, 255, 30, 0.4)',
  },
  cyan: {
    name: 'Cyan Blue',
    color: '#00D2FF',
    glow: 'rgba(0, 210, 255, 0.25)',
    border: 'rgba(0, 210, 255, 0.4)',
  },
  purple: {
    name: 'Electric Purple',
    color: '#BD5FFF',
    glow: 'rgba(189, 95, 255, 0.25)',
    border: 'rgba(189, 95, 255, 0.4)',
  },
  rose: {
    name: 'Rose Pink',
    color: '#FF3366',
    glow: 'rgba(255, 51, 102, 0.25)',
    border: 'rgba(255, 51, 102, 0.4)',
  },
  orange: {
    name: 'Amber Orange',
    color: '#FF9900',
    glow: 'rgba(255, 153, 0, 0.25)',
    border: 'rgba(255, 153, 0, 0.4)',
  },
} as const;

export const colors = {
  // Dark Theme Surfaces
  dark: {
    bgBase: '#0B0F19',
    surface1: '#131C31',
    surface2: '#1E293B',
    surface3: '#060911',
    border: 'rgba(255, 255, 255, 0.08)',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
  },
  // Light Theme Surfaces
  light: {
    bgBase: '#F8FAFC',
    surface1: '#FFFFFF',
    surface2: '#F1F5F9',
    surface3: '#E2E8F0',
    border: 'rgba(0, 0, 0, 0.08)',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
  },
  // Default Accent
  accent: accents.green,
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
    heading: 'Poppins, Inter, system-ui, sans-serif',
    mono: 'Fira Code, JetBrains Mono, monospace',
  },
  scales: {
    hero: { size: '4rem', lineHeight: '1.08', weight: '900' },
    h1: { size: '2.5rem', lineHeight: '1.2', weight: '800' },
    h2: { size: '1.875rem', lineHeight: '1.3', weight: '700' },
    h3: { size: '1.25rem', lineHeight: '1.4', weight: '600' },
    bodyLarge: { size: '1.125rem', lineHeight: '1.6', weight: '400' },
    bodyRegular: { size: '1.0rem', lineHeight: '1.6', weight: '400' },
    caption: { size: '0.8125rem', lineHeight: '1.5', weight: '500' },
  },
} as const;
