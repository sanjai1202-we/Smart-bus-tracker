import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08080F",
        textMain: "#F0F0FF",
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        routex: {
          bg: '#08080F',
          primary: '#5B4EFF', // Electric Indigo
          cyan: '#00FFD1',    // Neon Cyan
          danger: '#FF4E4E',  // Danger Red
          success: '#00E87A', // Vivid Green
          amber: '#FFB547',   // Parent Amber
          textMuted: '#7B7B9A',
          surface: 'rgba(255, 255, 255, 0.05)',
          surfaceHover: 'rgba(255, 255, 255, 0.1)',
        }
      },
      fontFamily: {
        display: ['var(--font-bebas)', 'Bebas Neue', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'DM Sans', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'monospace'],
      },
      keyframes: {
        kenBurns: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 15px rgba(91, 78, 255, 0.5)' },
          '50%': { opacity: '.7', boxShadow: '0 0 25px rgba(91, 78, 255, 0.8)' },
        },
        pulseRed: {
          '0%, 100%': { opacity: '1', boxShadow: 'inset 0 0 50px rgba(255, 78, 78, 0.5)' },
          '50%': { opacity: '.8', boxShadow: 'inset 0 0 100px rgba(255, 78, 78, 0.8)' },
        },
        draw: {
          '0%': { width: '0%', opacity: '0' },
          '100%': { width: '100%', opacity: '1' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        'ken-burns': 'kenBurns 20s ease-out infinite alternate',
        'pulse-glow': 'pulseGlow 2s infinite',
        'pulse-red': 'pulseRed 2s infinite',
        'draw-underline': 'draw 1.5s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
};
export default config;
