"use client";

import { Button } from "@/components/ui/button";
import { getYoutubeEmbedId } from "@/modules/course/utils";
import { CourseCover } from "@/shared/components/course";
import { Play } from "lucide-react";
import { useState } from "react";

export interface CourseIntroVideoProps {
  title: string;
  intro: string;
  image?: string;
}

/**
 * Video giới thiệu dạng "bấm mới tải": hiện ảnh bìa và nút phát, bấm mới gắn
 * iframe YouTube. Nhúng sẵn thì trang tải thêm vài trăm KB script của YouTube
 * ngay đầu trang dù người xem không bấm phát.
 */
export default function CourseIntroVideo({
  title,
  intro,
  image,
}: CourseIntroVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const youtubeId = getYoutubeEmbedId(intro);
  // Khóa chưa có ảnh bìa: lấy ảnh thumbnail của chính video
  const posterImage = image || `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;

  if (isPlaying) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="block aspect-video w-full"
      />
    );
  }

  return (
    <Button
      variant="link"
      onClick={() => setIsPlaying(true)}
      aria-label={`Phát video giới thiệu: ${title}`}
      className="group relative block aspect-video h-auto w-full rounded-none p-0"
    >
      <CourseCover
        image={posterImage}
        isPriority
        className="absolute inset-0"
        sizes="(min-width: 1280px) 360px, 100vw"
      />
      <span className="absolute inset-0 grid place-items-center bg-black/20 transition-colors group-hover:bg-black/30">
        <span className="grid size-14 place-items-center rounded-full bg-white/90 text-black shadow-lg transition-transform group-hover:scale-105">
          <Play className="ml-0.5 size-6 fill-current" />
        </span>
      </span>
    </Button>
  );
}
