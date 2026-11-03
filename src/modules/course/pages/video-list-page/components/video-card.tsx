import Link from "next/link";
import { CoursePrice, CourseRating } from "../../../components";
import type { VideoListItem } from "../../../types";
import { buildVideoPublicHref } from "../../../utils/course-manage.utils";
import { formatVideoMeta } from "../../../utils/video-list.utils";
import { VideoCover } from "./video-cover";

interface VideoCardProps {
  video: VideoListItem;
  /** Thẻ hàng đầu nằm ngay màn đầu: tải ảnh ngay, không đợi cuộn */
  isPriority?: boolean;
}

/**
 * Ảnh bìa là thứ kéo người xem nên chiếm nửa trên thẻ ở mọi khổ. "Miễn phí" và
 * thời lượng nằm ngay trên ảnh để lướt là thấy
 */
export function VideoCard({ video, isPriority = false }: VideoCardProps) {
  return (
    <Link
      href={buildVideoPublicHref(video.slug)}
      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface outline-none transition-colors hover:border-border-strong focus-visible:border-primary"
    >
      <VideoCover
        video={video}
        isPriority={isPriority}
        sizes="(min-width: 1600px) 25vw, (min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-4 sm:gap-2 sm:p-5">
        <h3 className="line-clamp-2 text-base font-semibold text-foreground">
          {video.title}
        </h3>
        <p className="text-xs text-muted">{formatVideoMeta(video)}</p>
        <div className="mt-auto flex min-h-5 items-center justify-between gap-2 pt-2.5 sm:pt-3">
          <CoursePrice course={video} />
          <CourseRating ratings={video.rating} shouldShowCount />
        </div>
      </div>
    </Link>
  );
}
