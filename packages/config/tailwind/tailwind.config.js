/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        ub: {
          void: '#07090e',
          surface1: '#0d111a',
          surface2: '#141a27',
          surface3: '#1c2436',
          cyan: '#00f0ff',
          emerald: '#00ff9d',
          violet: '#a855f7',
          muted: '#64748b',
          secondary: '#94a3b8',
          text: '#f8fafc',
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 25px rgba(0, 240, 255, 0.25)',
        'glow-emerald': '0 0 25px rgba(0, 255, 157, 0.25)',
        'glow-violet': '0 0 25px rgba(168, 85, 247, 0.25)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
    },
  },
  plugins: [],
};
