import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#0B7B83', hover: '#096269', light: '#E8F6F7', 50: '#E8F6F7', 100: '#C5E8EA', 200: '#97D5DA', 300: '#62BEC6', 400: '#3AA8B2', 500: '#0B7B83', 600: '#096269', 700: '#074E54', 800: '#053A3F', 900: '#03262A' },
        accent: { DEFAULT: '#D97706', 50: '#FFFBEB', 100: '#FEF3C7', 200: '#FDE68A', 300: '#FCD34D', 400: '#FBBF24', 500: '#D97706', 600: '#B45309', 700: '#92400E', 800: '#78350F', 900: '#451A03' },
      },
      fontFamily: { sans: ['var(--font-inter)', 'system-ui', 'sans-serif'], mono: ['var(--font-mono)', 'monospace'] },
      fontSize: { h1: ['2.5rem', { lineHeight: '1.2' }], h2: ['2rem', { lineHeight: '1.2' }], h3: ['1.5rem', { lineHeight: '1.2' }], h4: ['1.25rem', { lineHeight: '1.2' }] },
      animation: { 'fade-in': 'fadeIn 0.3s ease-out', 'slide-up': 'slideUp 0.3s ease-out', 'shimmer': 'shimmer 2s ease-in-out infinite' },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        shimmer: { '0%': { backgroundPosition: '200% 0' }, '100%': { backgroundPosition: '-200% 0' } },
      },
    },
  },
  plugins: [],
};

export default config;
