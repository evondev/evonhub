import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#926aff",
        secondary: "#ff69cf",
        text4: "#C9CAD1",
        text3: "#A3A3A3",
        text2: "#686A70",
        bgDark3: "#263142",
      },
      backgroundImage: {
        gradientPrimary: "linear-gradient(90deg, #926aff 0%, #ff69cf 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
