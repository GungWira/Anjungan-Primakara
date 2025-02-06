import type { Config } from "tailwindcss";

export default {
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
        mainBlue: "#1C2A58",
        darkBlue: "#18213F",
      },
      backgroundColor: {
        lightBlue: "#1CDEEC",
        mainBlue: "#1C2A58",
        darkBlue: "#18213F",
      },
      keyframes: {
        ring: {
          "0%": {
            transform: "scale(1)",
            opacity: "0.7",
          },
          "100%": {
            transform: "scale(3)",
            opacity: "0",
          },
        },
      },
      animation: {
        ring: "ring 1s ease-out forwards infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
