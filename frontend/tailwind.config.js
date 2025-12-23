/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '320px',
      },
      colors: {
        // Green theme palette - Deep Forest to Mint/Sage
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        sage: {
          50: '#f6f9f6',
          100: '#e8f3e8',
          200: '#d4e7d4',
          300: '#a8d0a8',
          400: '#7ab77a',
          500: '#5c9d5c',
          600: '#4a7f4a',
          700: '#3d663d',
          800: '#345034',
          900: '#2b422b',
          950: '#162316',
        },
        mint: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
      },
      backgroundImage: {
        'gradient-forest-dark': 'linear-gradient(180deg, #020604 0%, #052e16 60%, #14532d 100%)',
        'gradient-sage-light': 'linear-gradient(180deg, #e8f3e8 0%, #d4e7d4 50%, #a8d0a8 100%)',
        'gradient-glass-dark': 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
        'gradient-glass-light': 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
        'mesh-dark': 'radial-gradient(at 40% 20%, rgba(34, 197, 94, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(16, 185, 129, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(5, 150, 105, 0.1) 0px, transparent 50%), linear-gradient(180deg, #020604 0%, #052e16 60%, #14532d 100%)',
        'mesh-light': 'radial-gradient(at 40% 20%, rgba(168, 208, 168, 0.4) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(122, 183, 122, 0.3) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(92, 157, 92, 0.2) 0px, transparent 50%), linear-gradient(180deg, #e8f3e8 0%, #d4e7d4 50%, #a8d0a8 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass-dark': '0 8px 32px 0 rgba(5, 46, 22, 0.4)',
        'glass-light': '0 8px 32px 0 rgba(92, 157, 92, 0.15)',
        'glow-green': '0 0 20px rgba(34, 197, 94, 0.5)',
        'glow-sage': '0 0 15px rgba(122, 183, 122, 0.4)',
        'neumorphism-dark': '8px 8px 16px rgba(0, 0, 0, 0.3), -8px -8px 16px rgba(255, 255, 255, 0.02)',
        'neumorphism-light': '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9)',
      },
      fontFamily: {
        display: ['Manrope', 'system-ui', 'sans-serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'drawer-open': 'drawerOpen 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        drawerOpen: {
          '0%': { transform: 'translateY(calc(100% - 120px))' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
