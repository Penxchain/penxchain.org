import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: ["var(--font-poppins)", "sans-serif"], // 👈 DEFAULT
      space: ["var(--font-space)", "sans-serif"],
      jakarta: ["var(--font-jakarta)", "sans-serif"],
      poppins: ["var(--font-poppins)", "sans-serif"],
    },
    extend: {
      colors: {
        penx: {
          bg: "#020410",
          primary: "#2547D0",
          glass: "rgba(2, 4, 16, 0.6)",
        },
      },
    },
  },

  plugins: [],
};
export default config;
