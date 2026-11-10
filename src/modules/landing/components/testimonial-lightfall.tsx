"use client";

import dynamic from "next/dynamic";
import {
  TESTIMONIAL_LIGHTFALL_COLORS,
  TESTIMONIAL_LIGHTFALL_GLOW_COLOR,
} from "../constants";

const Lightfall = dynamic(() => import("@/components/react-bits/lightfall"), {
  ssr: false,
});

/**
 * Vệt sáng rơi xuống theo đường cong sau tiêu đề phần cảm nhận, uốn quanh con
 * trỏ. Bấm giữ thì vệt kéo dài như đi vào không gian
 */
export function TestimonialLightfall() {
  return (
    <Lightfall
      colors={TESTIMONIAL_LIGHTFALL_COLORS}
      backgroundColor={TESTIMONIAL_LIGHTFALL_GLOW_COLOR}
      speed={0.25}
      density={0.5}
      backgroundGlow={0.15}
      opacity={0.8}
    />
  );
}
