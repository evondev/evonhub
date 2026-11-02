"use client";

import { useEffect } from "react";
import { logLessonView } from "../actions";
import { ACTIVITY_HEARTBEAT_MS } from "../constants";

interface UseTrackLessonActivityProps {
  lessonId: string;
  courseId: string;
  /** Khách chưa đăng nhập thì không có gì để ghi */
  isEnabled: boolean;
}

/**
 * Báo cho nhật ký admin biết người dùng đang học bài này: một nhịp khi mở bài,
 * rồi cứ ACTIVITY_HEARTBEAT_MS một nhịp khi tab còn đang hiện. Tab ẩn thì thôi
 * gửi, quay lại tab là gửi ngay.
 */
export function useTrackLessonActivity({
  lessonId,
  courseId,
  isEnabled,
}: UseTrackLessonActivityProps) {
  useEffect(() => {
    if (!isEnabled || !lessonId || !courseId) return;

    function sendHeartbeat() {
      if (document.visibilityState !== "visible") return;

      // Mất mạng một nhịp thì bỏ qua, nhịp sau ghi bù
      logLessonView({ lessonId, courseId }).catch(() => undefined);
    }

    sendHeartbeat();
    const heartbeatIntervalId = window.setInterval(
      sendHeartbeat,
      ACTIVITY_HEARTBEAT_MS,
    );
    document.addEventListener("visibilitychange", sendHeartbeat);

    return () => {
      window.clearInterval(heartbeatIntervalId);
      document.removeEventListener("visibilitychange", sendHeartbeat);
    };
  }, [lessonId, courseId, isEnabled]);
}
