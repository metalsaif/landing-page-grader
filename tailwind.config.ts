import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // PASTE YOUR CUSTOM THEME OBJECT FROM THE OLD FILE HERE
      // For example:
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      colors: {
        'custom-dark': '#0f172a',
        'accent-cyan': '#22d3ee',
      },
    },
  },
  plugins: [],
};
export default config;