"use client";

import { NEAR_END_SECONDS } from "@/modules/lesson/constants";
// Bản lazy tách player (~200KB) khỏi bundle chính, tải khi khung video vào màn hình
import MuxPlayer from "@mux/mux-player-react/lazy";

export interface LessonVideoProps {
  videoId: string;
  iframeId: string;
  // Gọi liên tục trong 10 giây cuối video, nơi gọi tự lo việc chỉ ghi một lần
  onNearEnd: () => void;
  /** Trang học tự phát; trang video lẻ chờ người xem bấm */
  isAutoPlay?: boolean;
  /** Mỗi nhịp timeupdate, để đo phút học cho bảng xếp hạng */
  onPlaybackTick?: (player: HTMLMediaElement) => void;
}

// Video sát mép màn ở mobile, bo góc từ lg. Player tự có nút toàn màn hình.
export function LessonVideo({
  videoId,
  iframeId,
  onNearEnd,
  isAutoPlay = true,
  onPlaybackTick,
}: LessonVideoProps) {
  const handleTimeUpdate = (event: Event) => {
    const player = event.target as HTMLMediaElement | null;
    if (!player?.duration) return;

    onPlaybackTick?.(player);

    const isNearEnd = player.duration - player.currentTime <= NEAR_END_SECONDS;
    if (isNearEnd) onNearEnd();
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
      {!videoId && iframeId && (
        <iframe
          src={`https://drive.google.com/file/d/${iframeId}/preview`}
          className="size-full"
          allow="autoplay; fullscreen"
          title="Video bài học"
        />
      )}
    </div>
  );
}
