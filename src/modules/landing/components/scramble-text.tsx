"use client";

import { useEffect, useState } from "react";
import {
  SCRAMBLE_CHARACTERS,
  SCRAMBLE_DURATION_MS,
} from "../constants/review-demo.constants";

interface ScrambleTextProps {
  text: string;
}

/** Chữ hiện ra kiểu "giải mã": ký tự ngẫu nhiên chốt dần thành chữ thật */
export function ScrambleText({ text }: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    const isReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (isReducedMotion) {
      setDisplayText(text);
      return;
    }

    const startTime = performance.now();
    let animationFrameId = 0;

    function step(currentTime: number) {
      const progress = Math.min(
        (currentTime - startTime) / SCRAMBLE_DURATION_MS,
        1,
      );
      const resolvedCount = Math.floor(progress * text.length);
      const nextText = Array.from(text)
        .map((character, index) => {
          if (index < resolvedCount || character === " ") return character;

          return SCRAMBLE_CHARACTERS[
            Math.floor(Math.random() * SCRAMBLE_CHARACTERS.length)
          ];
        })
        .join("");

      setDisplayText(nextText);
      if (progress < 1) animationFrameId = requestAnimationFrame(step);
    }

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [text]);

  return (
    <span aria-label={text}>
      <span aria-hidden="true">{displayText}</span>
    </span>
  );
}
