import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        routex: {
          dark: "#07071A",
          primary: "#4F46E5",
          teal: "#06EFC5",
          danger: "#EF4444",
          success: "#10B981",
          amber: "#F59E0B",
          textMuted: "var(--text-muted)",
          glass: "var(--glass-bg)",
          glassBorder: "var(--glass-border)",
        }
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-mesh': 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)',
      },
      keyframes: {
        mesh: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        sweep: {
          '0%': { top: '0%', opacity: '0.4' },
          '50%': { opacity: '1' },
          '100%': { top: '100%', opacity: '0.4' }
        },
        strobe: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        'mesh': 'mesh 15s ease infinite',
        'sweep': 'sweep 3s infinite linear',
        'strobe': 'strobe 2s infinite ease-in-out',
        'float': 'float 6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
export default config;
