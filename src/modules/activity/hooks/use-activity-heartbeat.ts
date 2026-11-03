"use client";

import { useEffect, useRef } from "react";
import { ACTIVITY_HEARTBEAT_MS } from "../constants";

interface UseActivityHeartbeatProps {
  /** Đổi key (sang bài, video khác) là gửi nhịp mới ngay */
  heartbeatKey: string;
  /** Khách chưa đăng nhập thì không có gì để ghi */
  isEnabled: boolean;
  sendHeartbeat: () => Promise<void>;
}

/**
 * Báo cho nhật ký admin biết người dùng đang học: một nhịp khi mở trang, rồi cứ
 * ACTIVITY_HEARTBEAT_MS một nhịp khi tab còn đang hiện. Tab ẩn thì thôi gửi,
 * quay lại tab là gửi ngay.
 */
export function useActivityHeartbeat({
  heartbeatKey,
  isEnabled,
  sendHeartbeat,
}: UseActivityHeartbeatProps) {
  // Giữ hàm gửi mới nhất trong ref: hàm tạo lại mỗi render không làm chạy lại interval
  const sendHeartbeatRef = useRef(sendHeartbeat);

  useEffect(() => {
    sendHeartbeatRef.current = sendHeartbeat;
  });

  useEffect(() => {
    if (!isEnabled || !heartbeatKey) return;

    function handleHeartbeat() {
      if (document.visibilityState !== "visible") return;

      // Mất mạng một nhịp thì bỏ qua, nhịp sau ghi bù
      sendHeartbeatRef.current().catch(() => undefined);
    }

    handleHeartbeat();
    const heartbeatIntervalId = window.setInterval(
      handleHeartbeat,
      ACTIVITY_HEARTBEAT_MS,
    );
    document.addEventListener("visibilitychange", handleHeartbeat);

    return () => {
      window.clearInterval(heartbeatIntervalId);
      document.removeEventListener("visibilitychange", handleHeartbeat);
    };
  }, [heartbeatKey, isEnabled]);
}
