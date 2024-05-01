import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/constants/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        secondary: "#ff6bcb",
        primary: "#6a5af9",
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
        grayDarker: "#1F2024",
        grayDarkest: "#1A1B1E",
      },
    },
  },
  plugins: [],
};
export default withUt(config);
