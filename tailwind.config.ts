import type { Config } from "tailwindcss";
const plugin = require('tailwindcss/plugin');

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["var(--font-poppins)", "sans-serif"],
      space: ["var(--font-space)", "sans-serif"],
      jakarta: ["var(--font-jakarta)", "sans-serif"],
      poppins: ["var(--font-poppins)", "sans-serif"],
    },
    extend: {
      colors: {
        penx: {
          bg: "#020410",
          primary: "#2547D0",
          secondary: "#4F6EF7", // Added for the Angelic Gradient
          accent: "#FFFFFF",
          glass: "rgba(2, 4, 16, 0.6)",
        },
      },
      backgroundImage: {
        'angelic-glow': "radial-gradient(circle at center, rgba(37, 71, 208, 0.15) 0%, transparent 70%)",
        'heavenly-beam': "linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 0%, rgba(79, 110, 247, 0.05) 50%, transparent 100%)",
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        'shimmer': 'shimmer 3s infinite ease-in-out',
        'float': 'float 4s infinite ease-in-out',
        'spin-slow': 'spin-slow 12s linear infinite',
      },
    },
  },
  plugins: [
    // Custom plugin to handle the 3D "Flip" logic for the coins
    plugin(function ({ addUtilities }: any) {
      addUtilities({
        '.preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
        '.translate-z-10': {
          'transform': 'translateZ(10px)',
        },
        '.translate-z-neg-4': {
          'transform': 'translateZ(-4px)',
        },
      });
    }),
  ],
};
export default config;