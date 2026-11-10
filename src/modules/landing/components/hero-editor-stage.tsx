"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import { HERO_LASER_COLOR } from "../constants";
import { ReviewDemoEditor } from "./review-demo-editor";

const LaserFlow = dynamic(() => import("@/components/react-bits/laser-flow"), {
  ssr: false,
});

/**
 * Editor màn diễn đứng dưới một tia laser tím rọi thẳng xuống, bắn toé ở mép
 * trên rồi chảy tràn qua hai góc. Laser đo vị trí editor qua surfaceRef nên
 * khung bọc phải bo góc đúng như editor
 */
export function HeroEditorStage() {
  const editorFrameRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      {/* Mép trên của vùng laser nằm ngay dưới hàng điểm nổi bật (khoảng cách
          editor ở LandingHero), tia không chạy xuyên qua chữ. Mờ cả bốn mép
          để không lộ khung canvas */}
      <div
        aria-hidden="true"
        className="absolute -inset-x-40 -bottom-32 -top-14 -z-10 [-webkit-mask-composite:source-in] [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_80%,transparent),linear-gradient(to_right,transparent,black_12%,black_88%,transparent)] sm:-top-28"
      >
        <LaserFlow
          surfaceRef={editorFrameRef}
          beamPosition={0.5}
          color={HERO_LASER_COLOR}
          intensity={1.4}
          fog={0}
          dust={1}
          mouseInteraction={false}
        />
      </div>
      <div ref={editorFrameRef} className="rounded-2xl">
        <ReviewDemoEditor hasBorderBeam />
      </div>
    </div>
  );
}
