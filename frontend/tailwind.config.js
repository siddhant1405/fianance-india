/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#060810',
          card: '#0D1117',
          elevated: '#151A22',
          hover: '#1C2333',
          input: '#0A0D14',
        },
        accent: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
          muted: 'rgba(59, 130, 246, 0.15)',
          glow: 'rgba(59, 130, 246, 0.4)',
        },
        border: {
          DEFAULT: '#1E2533',
          hover: '#2A3241',
          active: '#3b82f6',
        },
        text: {
          primary: '#E2E8F0',
          secondary: '#94A3B8',
          muted: '#64748B',
          inverse: '#0B0E14',
        },
        success: {
          DEFAULT: '#10b981',
          bg: 'rgba(16, 185, 129, 0.1)',
        },
        danger: {
          DEFAULT: '#ef4444',
          bg: 'rgba(239, 68, 68, 0.1)',
        },
        warning: {
          DEFAULT: '#f59e0b',
          bg: 'rgba(245, 158, 11, 0.1)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 20px rgba(59, 130, 246, 0.15)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.25)',
        'card': '0 4px 30px rgba(0, 0, 0, 0.3)',
        'elevated': '0 8px 40px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
