"use client";

import { useEffect, useRef } from "react";

/**
 * Vệt sáng màu nhấn đi theo con trỏ trong card cha. Card cha cần
 * "group relative isolate overflow-hidden"; vệt sáng nằm dưới nội dung (-z-10)
 */
export function SpotlightOverlay() {
  const overlayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const overlayElement = overlayRef.current;
    const hostElement = overlayElement?.parentElement;

    if (!overlayElement || !hostElement) return;

    function handlePointerMove(event: PointerEvent) {
      if (!overlayElement || !hostElement) return;

      const hostRect = hostElement.getBoundingClientRect();

      overlayElement.style.setProperty(
        "--spotlight-x",
        `${event.clientX - hostRect.left}px`,
      );
      overlayElement.style.setProperty(
        "--spotlight-y",
        `${event.clientY - hostRect.top}px`,
      );
    }

    hostElement.addEventListener("pointermove", handlePointerMove);

    return () => {
      hostElement.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <span
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(360px_circle_at_var(--spotlight-x,50%)_var(--spotlight-y,50%),rgb(var(--primary)/0.14),transparent_70%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    />
  );
}
