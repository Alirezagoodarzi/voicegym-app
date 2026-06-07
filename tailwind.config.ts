import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,jsx,ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F5F7F2",
        surface: "#FFFFFF",
        "surface-2": "#EEF2E8",
        green: "#2D6A4F",
        "green-mid": "#40916C",
        "green-light": "#B7E4C7",
        lime: "#AAFF00",
        "text-1": "#1A1A1A",
        "text-2": "#4A4A4A",
        "text-3": "#9A9A9A",
        border: "#E0E7D8",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
