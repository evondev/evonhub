import { CourseCover } from "@/shared/components/course";
import { COURSE_LEVEL_LABELS } from "@/shared/constants/course.constants";
import { timeAgo } from "@/shared/utils";
import Link from "next/link";
import { CoursePrice, CourseRating } from "../../../components";
import type { VideoListItem } from "../../../types";
import { formatDurationMinutes, isCourseFree } from "../../../utils";
import { buildVideoPublicHref } from "../../../utils/course-manage.utils";

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
  const isFree = isCourseFree(video);
  const levelLabel = COURSE_LEVEL_LABELS[video.level];
  const metaText = [levelLabel, timeAgo(video.createdAt)]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={buildVideoPublicHref(video.slug)}
      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface outline-none transition-colors hover:border-border-strong focus-visible:border-primary"
    >
      <div className="relative">
        <CourseCover
          image={video.image}
          isPriority={isPriority}
          sizes="(min-width: 1600px) 25vw, (min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="aspect-video w-full"
        />
        {isFree && (
          <span className="absolute left-2 top-2 rounded-full bg-emerald-700 px-2 py-0.5 text-xs font-semibold text-white">
            Miễn phí
          </span>
        )}
        {video.duration > 0 && (
          <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 text-xs font-medium tabular-nums text-white">
            {formatDurationMinutes(video.duration)}
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-4 sm:gap-2 sm:p-5">
        <h3 className="line-clamp-2 text-pretty text-base font-semibold text-foreground">
          {video.title}
        </h3>
        <p className="text-xs text-muted">{metaText}</p>
        <div className="mt-auto flex min-h-5 items-center justify-between gap-2 pt-2.5 sm:pt-3">
          <CoursePrice course={video} />
          <CourseRating ratings={video.rating} shouldShowCount />
        </div>
      </div>
    </Link>
  );
}
