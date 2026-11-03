"use client";

import { useUserContext } from "@/components/user-context";
import { useTrackVideoActivity } from "@/modules/activity/hooks";
import { useTrackWatchTime } from "@/modules/leaderboard/hooks";
import { LessonVideo } from "@/modules/lesson/components";
import { useMutationCompleteLesson } from "@/shared/data";
import { parseEmbedVideo } from "@/shared/utils/video-embed.utils";
import { useRef } from "react";
import type { VideoDetailsLesson } from "../../../types";

export interface VideoPlayerProps {
  videoId: string;
  lesson: VideoDetailsLesson;
}

/** Player của video lẻ: xem gần hết thì ghi lịch sử một lần cho người đã đăng nhập */
export function VideoPlayer({ videoId, lesson }: VideoPlayerProps) {
  const mutateCompleteLesson = useMutationCompleteLesson();
  const { userInfo } = useUserContext();
  const hasRecordedRef = useRef(false);
  const userId = userInfo?._id || "";
  const playbackId = lesson.video || "";
  const embedVideo = parseEmbedVideo(lesson.iframe);
  useTrackVideoActivity({ videoId, isEnabled: !!userId });
  const { handlePlaybackTick } = useTrackWatchTime({
    lessonId: lesson._id,
    courseId: videoId,
    isEnabled: !!userId,
    // YouTube đọc được giờ phát như Mux; chỉ Drive phải tính theo thời gian tab hiện
    isIframe: !playbackId && embedVideo?.provider === "drive",
  });

  async function handleVideoNearEnd() {
    if (!userId || hasRecordedRef.current) return;

    hasRecordedRef.current = true;
    await mutateCompleteLesson.mutateAsync({
      lessonId: lesson._id,
      userId,
      courseId: videoId,
      isSingleton: true,
    });
  }

  if (!playbackId && !embedVideo) {
    return (
      <div className="grid aspect-video w-full place-items-center rounded-2xl bg-foreground/5 px-4 text-center text-sm text-muted">
        Video đang được cập nhật
      </div>
    );
  }

  // Trang có lề hai bên ở mọi khổ nên player bo góc luôn, không chỉ từ lg như trang học
  return (
    <div className="overflow-hidden rounded-2xl">
      <LessonVideo
        videoId={playbackId}
        embedVideo={embedVideo}
        onNearEnd={handleVideoNearEnd}
        onPlaybackTick={handlePlaybackTick}
        isAutoPlay={false}
      />
    </div>
  );
}
