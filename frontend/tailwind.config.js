/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ── Surface layers (dark default) ─────────────────────── */
        surface: {
          0: 'var(--surface-0)',   /* page background */
          1: 'var(--surface-1)',   /* card background */
          2: 'var(--surface-2)',   /* elevated / hover */
          3: 'var(--surface-3)',   /* input / inset */
        },
        /* ── Semantic colors ──────────────────────────────────── */
        gain:     { DEFAULT: '#00D26A', muted: 'rgba(0, 210, 106, 0.12)' },
        loss:     { DEFAULT: '#FF4757', muted: 'rgba(255, 71, 87, 0.12)' },
        accent:   { DEFAULT: '#00C6AE', hover: '#00B39E', muted: 'rgba(0, 198, 174, 0.12)', glow: 'rgba(0, 198, 174, 0.25)' },
        warning:  { DEFAULT: '#FFBE0B', muted: 'rgba(255, 190, 11, 0.12)' },
        /* ── Text hierarchy ───────────────────────────────────── */
        txt: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted:     'var(--text-muted)',
          inverse:   'var(--text-inverse)',
        },
        /* ── Border ───────────────────────────────────────────── */
        line: {
          DEFAULT: 'var(--border)',
          hover:   'var(--border-hover)',
        },
        /* ── AI accent ────────────────────────────────────────── */
        ai: {
          DEFAULT: '#8B5CF6',
          muted:   'rgba(139, 92, 246, 0.12)',
          glow:    'rgba(139, 92, 246, 0.25)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        'xl':  '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        'card':     '0 1px 3px rgba(0,0,0,0.2), 0 4px 20px rgba(0,0,0,0.15)',
        'elevated': '0 8px 40px rgba(0,0,0,0.3)',
        'glow':     '0 0 20px var(--glow-color, rgba(0, 198, 174, 0.15))',
        'glow-lg':  '0 0 40px var(--glow-color, rgba(0, 198, 174, 0.25))',
      },
      keyframes: {
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(100%)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(100%)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        'pop': {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 198, 174, 0.1)' },
          '50%':      { boxShadow: '0 0 40px rgba(0, 198, 174, 0.25)' },
        },
        'ticker-scroll': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'shimmer':        'shimmer 1.5s ease-in-out infinite',
        'fade-in-up':     'fade-in-up 0.4s ease-out forwards',
        'slide-up':       'slide-up 0.3s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.3s ease-out forwards',
        'pop':            'pop 0.3s ease-out',
        'pulse-glow':     'pulse-glow 3s ease-in-out infinite',
        'ticker-scroll':  'ticker-scroll 30s linear infinite',
      },
    },
  },
  plugins: [],
};
