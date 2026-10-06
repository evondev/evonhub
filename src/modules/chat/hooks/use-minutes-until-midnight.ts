"use client";

import { useEffect, useState } from "react";
import { getMinutesUntilMidnight } from "../utils";

/** Nhãn hạn xoá đổi theo phút, không cần chính xác tới giây */
const MINUTE_TICK_MS = 30_000;

/** Số phút còn lại tới 00:00 giờ Việt Nam, tự cập nhật khi tab đang mở */
export function useMinutesUntilMidnight(): number {
  const [minutesLeft, setMinutesLeft] = useState(getMinutesUntilMidnight);

  useEffect(() => {
    const tickTimer = window.setInterval(
      () => setMinutesLeft(getMinutesUntilMidnight()),
      MINUTE_TICK_MS,
    );

    return () => window.clearInterval(tickTimer);
  }, []);

  return minutesLeft;
}
