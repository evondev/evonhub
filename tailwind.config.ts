import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        secondary: "#2C8FFF",
        primary: "#978df8",
        third: "#fc806c",
        text4: "#C9CAD1",
        text3: "#A3A3A3",
        text2: "#686A70",
        text5: "#929CAD",
        bgDark3: "#263142",
        grayf4: "#F4F4F4",
        grayPrimary: "#262626",
        gray70: "#70767F",
        grayef: "#EFEFEF",
        grayb2: "#B2B8C6",
        grayDark: "#1C1F25",
        grayDarker: "#1F2026",
        grayDarkest: "#1A1B1E",
        textPrimary: "#262626",
        grayed: "#ededed",
      },
      screens: {
        "2xl": "1600px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default withUt(config);
