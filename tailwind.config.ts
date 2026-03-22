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
        tungsten: {
          navy: "#002854",
          blue: "#1E4D8C",
          gold: "#FFC600",
          dark: "#0E0E10",
          surface: "#F8F7F4",
          warm: "#F5F0E8",
          border: "#D9D9D9",
          lightblue: "#A7DCFB",
          steel: "#98AFC9",
          bright: "#00A0FB",
          bluegray: "#436080",
          muted: "#6B7280",
        },
      },
      fontFamily: {
        sans: ["Arial", "system-ui", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
      },
    },
  },
  plugins: [],
};

export default config;
