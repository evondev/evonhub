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
        secondary: "#FD5404",
        primary: "#0377FC",
        text4: "#C9CAD1",
        text3: "#A3A3A3",
        text2: "#686A70",
        bgDark3: "#263142",
        grayf4: "#F4F4F4",
        grayPrimary: "#1A1D1F",
        gray70: "#70767F",
        grayef: "#EFEFEF",
        grayb2: "#B2B8C6",
        grayDark: "#1C1F25",
        grayDarker: "#26282E",
        grayDarkest: "#101010",
      },
    },
  },
  plugins: [],
};
export default config;
