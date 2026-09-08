import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#D4AF37",
          light: "#FFD700",
          dark: "#B8941F",
        },
        black: {
          DEFAULT: "#070707",
          light: "#111111",
        }
      },
    },
  },
  plugins: [],
};
export default config;
