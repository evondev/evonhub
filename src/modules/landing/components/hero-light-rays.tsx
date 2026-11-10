"use client";

import dynamic from "next/dynamic";
import { HERO_LIGHT_RAYS_COLOR } from "../constants";

// WebGL chỉ chạy ở trình duyệt; tải lười để không chặn chữ hero hiện lên
const LightRays = dynamic(() => import("@/components/react-bits/light-rays"), {
  ssr: false,
});

/**
 * Chùm tia sáng rọi từ đỉnh hero xuống, nghiêng nhẹ theo con trỏ. Để dịu, chữ
 * tiêu đề nằm ngay trong vùng sáng nên sáng quá là khó đọc
 */
export function HeroLightRays() {
  return (
    <LightRays
      raysOrigin="top-center"
      raysColor={HERO_LIGHT_RAYS_COLOR}
      raysSpeed={0.8}
      lightSpread={0.6}
      rayLength={1.2}
      glow={0.35}
      haze={0.12}
      intensity={0.6}
      opacity={0.7}
      followMouse
      mouseInfluence={0.08}
      cursorShadow={false}
      clickPulse={false}
    />
  );
}
