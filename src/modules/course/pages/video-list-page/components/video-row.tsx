import Link from "next/link";
import { CoursePrice, CourseRating, VideoCover } from "../../../components";
import type { VideoListItem } from "../../../types";
import { buildVideoPublicHref } from "../../../utils/course-manage.utils";
import { formatVideoMeta } from "../../../utils/video-list.utils";

interface VideoRowProps {
  video: VideoListItem;
  /** Mấy hàng đầu nằm ngay màn đầu: tải ảnh ngay, không đợi cuộn */
  isPriority?: boolean;
}

/**
 * Một video một hàng: ảnh nhỏ bên trái, tên và mô tả hai dòng bên phải để chọn
 * theo nội dung. Điện thoại ẩn mô tả, một màn thấy được năm video. Mỗi hàng một
 * khung, rê vào viền đậm lên như thẻ ở dạng lưới
 */
export function VideoRow({ video, isPriority = false }: VideoRowProps) {
  return (
    <Link
      href={buildVideoPublicHref(video.slug)}
      className="group flex gap-3 rounded-2xl border border-border bg-surface p-3 outline-none transition-colors hover:border-border-strong focus-visible:border-primary sm:gap-5 sm:p-4"
    >
      <VideoCover
        video={video}
        isPriority={isPriority}
        sizes="(min-width: 640px) 224px, 128px"
        // Ảnh 128px không đủ chỗ cho cả lượt học lẫn thời lượng
        studyCountClassName="max-sm:hidden"
        className="w-32 shrink-0 self-start rounded-lg sm:w-56"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1 sm:gap-1.5">
        <h3 className="line-clamp-2 text-pretty text-sm font-semibold text-foreground sm:text-base">
          {video.title}
        </h3>
        {video.excerpt && (
          <p className="hidden text-pretty text-sm text-muted sm:line-clamp-2">
            {video.excerpt}
          </p>
        )}
        <p className="text-xs text-muted">{formatVideoMeta(video)}</p>
        <div className="mt-auto flex min-h-5 items-center gap-3 pt-1">
          <CoursePrice course={video} />
          <CourseRating ratings={video.rating} shouldShowCount />
        </div>
      </div>
    </Link>
  );
}
