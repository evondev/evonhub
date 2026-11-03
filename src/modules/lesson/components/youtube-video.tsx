"use client";

import type { PlaybackSnapshot } from "@/shared/types";
import { useEffect, useRef, useState } from "react";
import { YOUTUBE_POLL_INTERVAL_MS } from "../constants";
import { loadYoutubeIframeApi } from "../utils/load-youtube-iframe-api";

export interface YoutubeVideoProps {
  videoId: string;
  isAutoPlay: boolean;
  /** Như timeupdate của thẻ video: chỉ gọi khi giờ phát đổi */
  onPlayback: (snapshot: PlaybackSnapshot) => void;
}

/**
 * Player YouTube qua IFrame API để đọc được giờ phát: ghi hoàn thành bài và phút
 * học như video Mux. Script API bị chặn thì nhúng iframe thường, vẫn xem được
 * nhưng không ghi được
 */
export function YoutubeVideo({
  videoId,
  isAutoPlay,
  onPlayback,
}: YoutubeVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onPlaybackRef = useRef(onPlayback);
  const [hasApiError, setHasApiError] = useState(false);

  useEffect(() => {
    onPlaybackRef.current = onPlayback;
  }, [onPlayback]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    let isCancelled = false;
    let player: YoutubePlayer | undefined;
    let pollIntervalId: number | undefined;
    let lastReportedTime = -1;
    // API thay phần tử được giao bằng iframe: giao một div tự tạo, không giao div React quản lý
    const mountNode = document.createElement("div");

    container.appendChild(mountNode);

    function reportPlayback(youtubeApi: YoutubeIframeApi) {
      if (!player) return;

      const currentTime = player.getCurrentTime();

      if (currentTime === lastReportedTime) return;

      lastReportedTime = currentTime;
      onPlaybackRef.current({
        currentTime,
        duration: player.getDuration(),
        paused: player.getPlayerState() !== youtubeApi.PlayerState.PLAYING,
      });
    }

    loadYoutubeIframeApi()
      .then((youtubeApi) => {
        if (isCancelled) return;

        player = new youtubeApi.Player(mountNode, {
          videoId,
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: isAutoPlay ? 1 : 0,
            playsinline: 1,
            rel: 0,
          },
          events: {
            onReady: () => {
              pollIntervalId = window.setInterval(
                () => reportPlayback(youtubeApi),
                YOUTUBE_POLL_INTERVAL_MS,
              );
            },
          },
        });
      })
      .catch(() => {
        if (!isCancelled) setHasApiError(true);
      });

    return () => {
      isCancelled = true;
      window.clearInterval(pollIntervalId);
      player?.destroy();
      container.replaceChildren();
    };
  }, [videoId, isAutoPlay]);

  if (hasApiError) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&playsinline=1`}
        className="size-full"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        title="Video bài học"
      />
    );
  }

  return <div ref={containerRef} className="size-full [&_iframe]:size-full" />;
}
