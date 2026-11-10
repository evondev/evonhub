"use client";

import { useEffect, useRef, useState } from "react";
import { COUNT_UP_DURATION_MS } from "../constants";
import { StatValueFormat } from "../types";
import { formatStatValue } from "../utils/format-stat-value";

interface CountUpValueProps {
  value: number;
  format: StatValueFormat;
}

/**
 * Con số đếm từ 0 lên khi cuộn tới. Server render sẵn giá trị thật (không có
 * JavaScript vẫn đúng số); máy bật giảm chuyển động thì giữ nguyên số
 */
export function CountUpValue({ value, format }: CountUpValueProps) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const valueElement = valueRef.current;
    const isReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!valueElement || isReducedMotion) return;

    let animationFrameId = 0;

    function animateCountUp() {
      const startTime = performance.now();

      function step(currentTime: number) {
        const progress = Math.min(
          (currentTime - startTime) / COUNT_UP_DURATION_MS,
          1,
        );
        const easedProgress = 1 - (1 - progress) ** 3;

        setDisplayValue(value * easedProgress);
        if (progress < 1) animationFrameId = requestAnimationFrame(step);
      }

      animationFrameId = requestAnimationFrame(step);
    }

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          // Chưa tới thì để 0, cuộn tới mới đếm lên
          setDisplayValue(0);
          return;
        }

        visibilityObserver.disconnect();
        animateCountUp();
      },
      { threshold: 0.6 },
    );

    visibilityObserver.observe(valueElement);

    return () => {
      visibilityObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [value]);

  return (
    <span ref={valueRef} aria-label={formatStatValue(value, format)}>
      <span aria-hidden="true">{formatStatValue(displayValue, format)}</span>
    </span>
  );
}
