"use client";

import { useTheme } from "next-themes";
import dynamic from "next/dynamic";

const DotGrid = dynamic(() => import("@/components/react-bits/dot-grid"), {
  ssr: false,
});

/** Lưới chấm phản ứng theo con trỏ, nền của card CTA cuối trang */
export function CtaDotGrid() {
  const { resolvedTheme } = useTheme();
  const isDarkTheme = resolvedTheme === "dark";

  return (
    <DotGrid
      dotSize={4}
      gap={22}
      baseColor={isDarkTheme ? "#34313f" : "#e3e0f7"}
      activeColor={isDarkTheme ? "#978df8" : "#6c5fe6"}
      proximity={130}
    />
  );
}
