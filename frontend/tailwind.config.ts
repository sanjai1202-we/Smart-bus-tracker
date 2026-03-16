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
          primary: '#5B4EFF',
          cyan: '#00FFD1',
          danger: '#FF4E4E',
          success: '#00E87A',
          amber: '#FFB547',
          textMuted: '#7B7B9A',
          surface: 'rgba(255, 255, 255, 0.05)',
          surfaceHover: 'rgba(255, 255, 255, 0.1)',
        }
      },
      fontFamily: {
        display: ['var(--font-bebas)'],
        body: ['var(--font-dm-sans)'],
        mono: ['var(--font-jetbrains-mono)'],
      },
      animation: {
        'ken-burns': 'kenBurns 20s ease-out infinite alternate',
        'pulse-glow': 'pulseGlow 2s infinite',
        'pulse-red': 'pulseRed 2s infinite',
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
        }
      }
    },
  },
  plugins: [],
};
export default config;
