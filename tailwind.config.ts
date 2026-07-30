import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#B71C1C",
          50: "#FDECEC",
          100: "#F9C9C9",
          600: "#B71C1C",
          700: "#911616",
          800: "#6E1010",
        },
        surface: "#FAFAFA",
      },
      fontFamily: {
        sans: ["Calibri", "Segoe UI", "Arial", "sans-serif"],
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
      },
      boxShadow: {
        soft: "0 2px 12px rgba(16, 24, 40, 0.06)",
        elevated: "0 8px 30px rgba(16, 24, 40, 0.10)",
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 300ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
