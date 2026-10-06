"use client";

import { useEffect, useRef } from "react";
import { getNextVietnamMidnight } from "../utils";

/** Trễ thêm chút sau nửa đêm để server chắc chắn đã sang ngày mới */
const MIDNIGHT_DELAY_MS = 1000;

/** Gọi onReset lúc 00:00 giờ Việt Nam mỗi ngày, khi tab vẫn đang mở */
export function useMidnightReset(onReset: () => void) {
  const onResetRef = useRef(onReset);

  useEffect(() => {
    onResetRef.current = onReset;
  });

  useEffect(() => {
    let resetTimer: number;

    function scheduleNextReset() {
      const delay =
        getNextVietnamMidnight().getTime() - Date.now() + MIDNIGHT_DELAY_MS;

      resetTimer = window.setTimeout(() => {
        onResetRef.current();
        scheduleNextReset();
      }, delay);
    }

    scheduleNextReset();

    return () => window.clearTimeout(resetTimer);
  }, []);
}
