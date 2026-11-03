"use client";

import type { PlaybackSnapshot } from "@/shared/types";
import { useCallback, useEffect, useRef } from "react";
import { recordWatchProgress } from "../actions";
import {
  IFRAME_TICK_MS,
  MAX_PLAYBACK_RATE,
  MAX_TICK_GAP_SECONDS,
  TICK_TOLERANCE_SECONDS,
  WATCH_BUCKET_SECONDS,
  WATCH_FLUSH_INTERVAL_MS,
} from "../constants";

interface UseTrackWatchTimeProps {
  lessonId: string;
  courseId: string;
  /** Khách, hoặc người chưa mở được khoá: không có gì để ghi */
  isEnabled: boolean;
  /** Video Google Drive: không đọc được giờ phát, tính theo thời gian tab còn hiện */
  isIframe: boolean;
}

interface PlaybackTick {
  mediaTime: number;
  wallTime: number;
}

interface WatchTimeTracker {
  /** Gắn vào mỗi nhịp phát: timeupdate của Mux, nhịp đọc giờ phát của YouTube */
  handlePlaybackTick: (player: PlaybackSnapshot) => void;
}

function isPageVisible() {
  return document.visibilityState === "visible";
}

/**
 * Đo phút học thật cho bảng xếp hạng. Video chia ô 10 giây; ô chỉ được tính khi
 * video phát liền qua hết ô đó, tab đang hiện, không tua. Các ô gom lại rồi cứ
 * WATCH_FLUSH_INTERVAL_MS gửi một lần, và gửi ngay khi rời tab hay đổi bài.
 */
export function useTrackWatchTime({
  lessonId,
  courseId,
  isEnabled,
  isIframe,
}: UseTrackWatchTimeProps): WatchTimeTracker {
  const markBucketRef = useRef<(bucket: number) => void>(() => undefined);
  const lastTickRef = useRef<PlaybackTick | null>(null);

  useEffect(() => {
    lastTickRef.current = null;

    if (!isEnabled || !lessonId || !courseId) return;

    // Tập ô riêng cho mỗi bài: lỗi mạng của bài cũ trả ô về đúng tập của bài cũ
    const pendingBuckets = new Set<number>();
    const sentBuckets = new Set<number>();

    function markBucket(bucket: number) {
      if (!sentBuckets.has(bucket)) pendingBuckets.add(bucket);
    }

    function flushBuckets() {
      if (pendingBuckets.size === 0) return;

      const buckets = Array.from(pendingBuckets);

      pendingBuckets.clear();
      buckets.forEach((bucket) => sentBuckets.add(bucket));
      recordWatchProgress({ lessonId, courseId, buckets }).catch(() => {
        // Mất mạng: trả ô về hàng chờ, nhịp sau gửi lại
        buckets.forEach((bucket) => {
          sentBuckets.delete(bucket);
          pendingBuckets.add(bucket);
        });
      });
    }

    function handleVisibilityChange() {
      // Quay lại tab thì nhịp đầu chỉ làm mốc, không nối với nhịp trước khi rời
      lastTickRef.current = null;

      if (!isPageVisible()) flushBuckets();
    }

    markBucketRef.current = markBucket;
    const flushIntervalId = window.setInterval(
      flushBuckets,
      WATCH_FLUSH_INTERVAL_MS,
    );
    // Drive: mở bài từ đầu thì ô cũng đếm lại từ 0, ô đã tính không cộng lần hai
    let iframeBucket = 0;
    const iframeTickIntervalId = isIframe
      ? window.setInterval(() => {
          if (!isPageVisible()) return;

          markBucket(iframeBucket);
          iframeBucket += 1;
        }, IFRAME_TICK_MS)
      : undefined;
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      markBucketRef.current = () => undefined;
      window.clearInterval(flushIntervalId);
      window.clearInterval(iframeTickIntervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      flushBuckets();
    };
  }, [lessonId, courseId, isEnabled, isIframe]);

  const handlePlaybackTick = useCallback((player: PlaybackSnapshot) => {
    const now = performance.now();
    const lastTick = lastTickRef.current;

    lastTickRef.current = { mediaTime: player.currentTime, wallTime: now };

    if (!lastTick || player.paused || !isPageVisible()) return;

    const mediaDelta = player.currentTime - lastTick.mediaTime;
    const wallDelta = (now - lastTick.wallTime) / 1000;
    // Tua tới thì giờ phát nhảy nhanh hơn thời gian thật; tua lui thì giảm
    const isContinuous =
      mediaDelta > 0 &&
      wallDelta <= MAX_TICK_GAP_SECONDS &&
      mediaDelta <= wallDelta * MAX_PLAYBACK_RATE + TICK_TOLERANCE_SECONDS;

    if (!isContinuous) return;

    const previousBucket = Math.floor(lastTick.mediaTime / WATCH_BUCKET_SECONDS);
    const currentBucket = Math.floor(player.currentTime / WATCH_BUCKET_SECONDS);

    // Vừa phát qua hết một ô thì tính ô đó
    if (currentBucket > previousBucket) markBucketRef.current(previousBucket);
  }, []);

  return { handlePlaybackTick };
}
