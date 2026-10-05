"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Theo dõi một media query. Phía server và lần render đầu luôn trả false, nên
 * giao diện dựng theo màn hẹp trước rồi đổi sau khi mount.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", onChange);

      return () => mediaQueryList.removeEventListener("change", onChange);
    },
    [query],
  );
  const getSnapshot = () => window.matchMedia(query).matches;
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
