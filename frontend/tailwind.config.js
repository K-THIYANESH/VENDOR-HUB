/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48', // Primary neon-rose/magenta brand color
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        ai: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Secondary cyan AI color
          600: '#0d9488',
          700: '#0f766e',
        },
        neon: {
          magenta: '#ff007f',
          cyan: '#00f0ff',
          purple: '#bd00ff',
          pink: '#ff00ff',
        },
        instagram: {
          orange: '#f77737',
          pink: '#e1306c',
          magenta: '#c13584',
          purple: '#833ab4',
          yellow: '#fcaf45',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 4px 30px rgba(0, 0, 0, 0.03)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.04)',
        glow: '0 0 15px rgba(99, 102, 241, 0.15)',
        aiGlow: '0 0 20px rgba(6, 182, 212, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'shimmer': 'shimmer 2.5s infinite linear',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.1)' },
          '100%': { boxShadow: '0 0 18px rgba(99, 102, 241, 0.3)' },
        }
      }
    },
  },
  plugins: [],
}
