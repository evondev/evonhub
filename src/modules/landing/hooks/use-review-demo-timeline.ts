"use client";

import { RefObject, useEffect, useState } from "react";
import { ReviewDemoFrame } from "../types";
import {
  getReviewDemoFrame,
  REVIEW_DEMO_CYCLE_MS,
  REVIEW_DEMO_FINAL_FRAME,
} from "../utils/review-demo";

/**
 * Chạy vòng lặp màn diễn trong editor. Dừng khi editor ra khỏi màn hình hoặc
 * tab bị ẩn; máy bật giảm chuyển động thì đứng yên ở khung đã sửa xong
 */
export function useReviewDemoTimeline(
  containerRef: RefObject<HTMLElement>,
): ReviewDemoFrame {
  const [frame, setFrame] = useState<ReviewDemoFrame>(() =>
    getReviewDemoFrame(0),
  );

  useEffect(() => {
    const containerElement = containerRef.current;
    const isReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!containerElement || isReducedMotion) {
      setFrame(REVIEW_DEMO_FINAL_FRAME);
      return;
    }

    let animationFrameId = 0;
    let lastTime = 0;
    let elapsedMs = 0;
    let isOnScreen = true;

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isOnScreen = entry.isIntersecting;
    });

    function tick(currentTime: number) {
      const isRunning = isOnScreen && !document.hidden;

      if (lastTime && isRunning) {
        elapsedMs = (elapsedMs + currentTime - lastTime) % REVIEW_DEMO_CYCLE_MS;
        setFrame(getReviewDemoFrame(elapsedMs));
      }

      lastTime = currentTime;
      animationFrameId = requestAnimationFrame(tick);
    }

    visibilityObserver.observe(containerElement);
    animationFrameId = requestAnimationFrame(tick);

    return () => {
      visibilityObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, [containerRef]);

  return frame;
}
