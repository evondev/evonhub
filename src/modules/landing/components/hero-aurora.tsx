"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { HERO_AURORA_COLOR_STOPS } from "../constants";

// WebGL chỉ chạy ở trình duyệt; tải lười để không chặn chữ hero hiện lên
const Aurora = dynamic(() => import("@/components/react-bits/aurora"), {
  ssr: false,
});

/** Nền Aurora sau tiêu đề hero, đổi cách hoà màu theo giao diện sáng tối */
export function HeroAurora() {
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === "dark";

  return (
    <Aurora
      colorStops={HERO_AURORA_COLOR_STOPS}
      lightMode={!isDarkTheme}
      amplitude={1.1}
      blend={0.55}
      speed={0.6}
      opacity={isDarkTheme ? 0.85 : 0.6}
      mouseInteraction={false}
    />
  );
}
