"use client";

import { logLessonView } from "../actions";
import { useActivityHeartbeat } from "./use-activity-heartbeat";

interface UseTrackLessonActivityProps {
  lessonId: string;
  courseId: string;
  /** Khách chưa đăng nhập thì không có gì để ghi */
  isEnabled: boolean;
}

/** Nhịp "đang học bài này" cho nhật ký admin */
export function useTrackLessonActivity({
  lessonId,
  courseId,
  isEnabled,
}: UseTrackLessonActivityProps) {
  useActivityHeartbeat({
    heartbeatKey: lessonId && courseId ? `${courseId}:${lessonId}` : "",
    isEnabled,
    sendHeartbeat: () => logLessonView({ lessonId, courseId }),
  });
}
