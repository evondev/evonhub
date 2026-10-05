"use client";

import { RefObject, useEffect, useState } from "react";

/** True khi phần tử đã cuộn lên khỏi mép trên màn hình (không tính lúc còn ở dưới) */
export function useIsElementPassed(elementRef: RefObject<HTMLElement>) {
  const [isPassed, setIsPassed] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsPassed(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef]);

  return isPassed;
}
