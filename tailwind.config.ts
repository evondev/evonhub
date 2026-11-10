import type { Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        secondary: "#2C8FFF",
        primary: "rgb(var(--primary) / <alpha-value>)",
        "primary-foreground": "rgb(var(--primary-foreground) / <alpha-value>)",
        "primary-strong": "rgb(var(--primary-strong) / <alpha-value>)",
        progress: "rgb(var(--progress) / <alpha-value>)",
        background: "rgb(var(--background) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        "item-hover": "var(--item-hover)",
        "item-active": "var(--item-active)",
        "button-hover": "var(--button-hover)",
        "brand-band": "rgb(var(--brand-band) / <alpha-value>)",
        "brand-band-end": "rgb(var(--brand-band-end) / <alpha-value>)",
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
      boxShadow: {
        popover: "var(--elevation-popover)",
        "segment-track": "var(--shadow-segment-track)",
        "segment-thumb": "var(--shadow-segment-thumb)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
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
        // Dải chứa hai bản nội dung giống nhau, trôi hết một bản là quay về đầu
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        // Hiệu ứng vào trang của landing (cùng nhịp với evon.dev)
        "blur-in": {
          "0%": {
            opacity: "0",
            filter: "blur(10px)",
            transform: "translateY(-14px)",
          },
          "50%": {
            opacity: "0.5",
            filter: "blur(5px)",
            transform: "translateY(3px)",
          },
          "100%": { opacity: "1", filter: "blur(0)", transform: "none" },
        },
        "hero-rise": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "none" },
        },
        "line-in": {
          from: { opacity: "0", transform: "translateX(-6px)" },
          to: { opacity: "1", transform: "none" },
        },
        // Vệt sáng lướt qua chữ (dùng với class text-shine)
        "caret-blink": {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
        // Tia sáng chạy dọc đường nối các bước (phần tử rộng 1/4 đường)
        "beam-travel": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(400%)" },
        },
        // Ô sáng trong lưới CTA cuối landing sáng tím lên rồi tắt
        "pixel-twinkle": {
          "0%, 100%": { backgroundColor: "rgb(255 255 255 / 0.03)" },
          "50%": { backgroundColor: "rgb(167 139 250 / 0.14)" },
        },
        shine: {
          "0%": { backgroundPosition: "150% 0" },
          "60%, 100%": { backgroundPosition: "-50% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee 70s linear infinite",
        // "both": chữ ẩn trong lúc chờ animation-delay, không nháy lên rồi mới chạy
        "blur-in": "blur-in 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        "hero-rise": "hero-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) both",
        "line-in": "line-in 0.4s ease-out both",
        shine: "shine 4s ease-in-out infinite",
        "caret-blink": "caret-blink 1s step-end infinite",
        "beam-travel": "beam-travel 3.5s ease-in-out infinite",
        "pixel-twinkle": "pixel-twinkle 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default withUt(config);
