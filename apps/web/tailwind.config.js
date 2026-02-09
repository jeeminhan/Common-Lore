/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary palette
        navy: {
          50: '#f0f4ff',
          100: '#e0e8ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#1e3a5f',
          900: '#0f172a',
          950: '#0a0f1a',
        },
        // Suit colors
        spades: {
          DEFAULT: '#1e40af',
          light: '#3b82f6',
        },
        hearts: {
          DEFAULT: '#dc2626',
          light: '#f87171',
        },
        diamonds: {
          DEFAULT: '#eab308',
          light: '#fde047',
        },
        clubs: {
          DEFAULT: '#16a34a',
          light: '#4ade80',
        },
        // Accent colors
        teal: {
          DEFAULT: '#0d9488',
          light: '#14b8a6',
        },
        gold: {
          DEFAULT: '#d4a574',
          light: '#e8c9a5',
        },
        // Feedback / accent
        purple: {
          DEFAULT: '#7b1fa2',
          light: '#9c27b0',
        },
        // Card colors
        card: {
          face: '#faf5f0',
          back: '#0f172a',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'card-flip': 'cardFlip 0.6s ease-in-out',
        'card-deal': 'cardDeal 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        cardFlip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        cardDeal: {
          '0%': { transform: 'translateY(-100px) scale(0.8)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover':
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card-active':
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
