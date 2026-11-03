"use client";

import { NEAR_END_SECONDS } from "@/modules/lesson/constants";
import type { EmbedVideo, PlaybackSnapshot } from "@/shared/types";
// Bản lazy tách player (~200KB) khỏi bundle chính, tải khi khung video vào màn hình
import MuxPlayer from "@mux/mux-player-react/lazy";
import { YoutubeVideo } from "./youtube-video";

export interface LessonVideoProps {
  videoId: string;
  /** Link YouTube / Google Drive của bài, dùng khi không có video Mux */
  embedVideo: EmbedVideo | null;
  // Gọi liên tục trong 10 giây cuối video, nơi gọi tự lo việc chỉ ghi một lần
  onNearEnd: () => void;
  /** Trang học tự phát; trang video lẻ chờ người xem bấm */
  isAutoPlay?: boolean;
  /** Mỗi nhịp phát, để đo phút học cho bảng xếp hạng */
  onPlaybackTick?: (snapshot: PlaybackSnapshot) => void;
}

// Video sát mép màn ở mobile, bo góc từ lg. Player tự có nút toàn màn hình.
export function LessonVideo({
  videoId,
  embedVideo,
  onNearEnd,
  isAutoPlay = true,
  onPlaybackTick,
}: LessonVideoProps) {
  const handlePlayback = (snapshot: PlaybackSnapshot) => {
    if (!snapshot.duration) return;

    onPlaybackTick?.(snapshot);

    const isNearEnd =
      snapshot.duration - snapshot.currentTime <= NEAR_END_SECONDS;
    if (isNearEnd) onNearEnd();
  };

  const handleTimeUpdate = (event: Event) => {
    const player = event.target as HTMLMediaElement | null;
    if (!player) return;

    handlePlayback(player);
  };

  return (
    <div className="relative aspect-video w-full overflow-hidden bg-black lg:rounded-2xl">
      {videoId && (
        <MuxPlayer
          streamType="on-demand"
          playbackId={videoId}
          className="block size-full"
          autoPlay={isAutoPlay}
          onTimeUpdate={handleTimeUpdate}
        />
      )}
      {!videoId && embedVideo?.provider === "youtube" && (
        <YoutubeVideo
          videoId={embedVideo.id}
          isAutoPlay={isAutoPlay}
          onPlayback={handlePlayback}
        />
      )}
      {!videoId && embedVideo?.provider === "drive" && (
        <iframe
          src={`https://drive.google.com/file/d/${embedVideo.id}/preview`}
          className="size-full"
          allow="autoplay; fullscreen"
          title="Video bài học"
        />
      )}
    </div>
  );
}
