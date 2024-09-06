import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"], // Ensure Roboto is included
      },
      fontWeight: {
        light: "100",
        regular: "200",
        medium: "300",
        semibold: "400",
        bold: "700",
        // Add additional font weights if needed
      },
    },
  },
  plugins: [],
};

export default config;
