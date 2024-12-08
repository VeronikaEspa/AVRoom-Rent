import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryColor: "#cd7317",
        primaryColorDark: "rgb(177 101 22)",
        whiteColor: "#ffffff",
        grayColor: "#333"
      },
    },
  },
  plugins: [],
} satisfies Config;
