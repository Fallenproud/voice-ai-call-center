import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Velora Voice™ Brand Colors
        background: '#0D0D0F',
        surface: {
          DEFAULT: '#1A1A1C',
          elevated: '#27272A',
          hover: '#2A2A2D',
          active: '#323235',
          border: '#3F3F46',
        },
        primary: {
          DEFAULT: '#7C3AED',
          50: '#F3F0FF',
          100: '#E9E2FF',
          200: '#D4C9FF',
          500: '#7C3AED',
          600: '#6D28D9',
          700: '#5B21B6',
          900: '#3F1A7B',
        },
        accent: {
          DEFAULT: '#06B6D4',
          50: '#F0FDFF',
          100: '#E6FFFF',
          200: '#BAF5FF',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
          900: '#164E63',
        },
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
        text: {
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
          muted: '#71717A',
          disabled: '#52525B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%)',
        'gradient-surface': 'linear-gradient(135deg, #1A1A1C 0%, #27272A 100%)',
        'gradient-hover': 'linear-gradient(135deg, #2A2A2D 0%, #323235 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(124, 58, 237, 0.3)',
        'glow-accent': '0 0 20px rgba(6, 182, 212, 0.3)',
        'velora-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'velora-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'velora-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'velora-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      borderRadius: {
        'velora': '1rem',
        'velora-lg': '1.5rem',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'wave': 'wave-animation 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            opacity: '1',
            boxShadow: '0 0 5px rgba(124, 58, 237, 0.4)',
          },
          '50%': {
            opacity: '0.8',
            boxShadow: '0 0 20px rgba(124, 58, 237, 0.8)',
          },
        },
        'wave-animation': {
          '0%': { height: '20%' },
          '25%': { height: '60%' },
          '50%': { height: '100%' },
          '75%': { height: '40%' },
          '100%': { height: '20%' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        'velora': '10px',
      },
    },
  },
  plugins: [],
}

export default config