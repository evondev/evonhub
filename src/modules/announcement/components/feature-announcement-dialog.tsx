"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// Import thẳng từ file: hộp nằm trong layout của mọi trang, barrel của course
// kéo theo nhiều component không dùng tới
import { VideoCover } from "@/modules/course/components/video-cover";
import { formatVideoMeta } from "@/modules/course/utils/video-list.utils";
import { Play, Sparkles, Youtube } from "lucide-react";
import { useFeatureAnnouncement } from "../hooks/use-feature-announcement";
import { AnnouncedVideoLink } from "./announced-video-link";

interface FeatureAnnouncementDialogProps {
  isEnabled: boolean;
}

/**
 * Hộp giới thiệu video mới, bật một lần cho mỗi người sau khi đăng nhập. Ảnh bìa
 * và nút chính đều mở video (YouTube ở tab mới), bấm là đóng hộp luôn
 */
export function FeatureAnnouncementDialog({
  isEnabled,
}: FeatureAnnouncementDialogProps) {
  const { isOpen, setIsOpen, video } = useFeatureAnnouncement({ isEnabled });

  if (!video) return null;

  const watchLabel = video.youtubeUrl ? "Xem trên YouTube" : "Xem video";

  function handleClose() {
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[calc(100%-2rem)] max-w-md gap-0 rounded-2xl border-border bg-surface p-6 sm:rounded-2xl dark:border-border dark:bg-surface">
        <DialogHeader className="pr-8 text-left">
          <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary-strong">
            <Sparkles className="size-3.5" aria-hidden />
            Video mới trên EvonHub
          </span>
          <DialogTitle className="text-pretty text-lg font-semibold text-foreground">
            {video.title}
          </DialogTitle>
          <DialogDescription className="mt-1 text-pretty text-sm/6 text-muted">
            Mình vừa làm xong video này, bạn xem thử nhé. {formatVideoMeta(video)}
          </DialogDescription>
        </DialogHeader>
        <AnnouncedVideoLink
          video={video}
          onClick={handleClose}
          aria-label={`${watchLabel}: ${video.title}`}
          className="group relative mt-5 block overflow-hidden rounded-xl border border-border outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <VideoCover video={video} sizes="448px" isPriority />
          <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/15 motion-reduce:transition-none">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-white/40 transition-transform group-hover:scale-110 motion-reduce:transition-none">
              <Play className="size-6 translate-x-0.5 fill-current" aria-hidden />
            </span>
          </span>
        </AnnouncedVideoLink>
        <Button
          asChild
          variant="primary"
          size="lg"
          className="mt-5 w-full font-semibold"
        >
          <AnnouncedVideoLink video={video} onClick={handleClose}>
            {video.youtubeUrl ? (
              <Youtube className="size-5" aria-hidden />
            ) : (
              <Play className="size-4 fill-current" aria-hidden />
            )}
            {watchLabel}
          </AnnouncedVideoLink>
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={handleClose}
          className="mt-2 w-full font-normal"
        >
          Để sau
        </Button>
      </DialogContent>
    </Dialog>
  );
}
