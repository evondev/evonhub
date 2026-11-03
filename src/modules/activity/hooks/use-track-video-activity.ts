"use client";

import { logVideoView } from "../actions";
import { useActivityHeartbeat } from "./use-activity-heartbeat";

interface UseTrackVideoActivityProps {
  videoId: string;
  /** Khách chưa đăng nhập thì không có gì để ghi */
  isEnabled: boolean;
}

/** Nhịp "đang xem video này" cho nhật ký admin */
export function useTrackVideoActivity({
  videoId,
  isEnabled,
}: UseTrackVideoActivityProps) {
  useActivityHeartbeat({
    heartbeatKey: videoId,
    isEnabled,
    sendHeartbeat: () => logVideoView({ videoId }),
  });
}
