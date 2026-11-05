import { CourseCover } from "@/shared/components/course";
import { cn } from "@/shared/utils";
import type { VideoListItem } from "../types";
import { formatDurationMinutes, isCourseFree } from "../utils";

interface VideoCoverProps {
  video: VideoListItem;
  sizes: string;
  isPriority: boolean;
  className?: string;
  /** Ảnh hẹp, góc dưới đã có thời lượng thì ẩn lượt học để khỏi đè nhau */
  studyCountClassName?: string;
}

/**
 * Ảnh bìa video kèm "Sắp ra mắt", "Miễn phí" ở góc trên và thời lượng ở góc
 * dưới, để lướt là thấy
 */
export function VideoCover({
  video,
  sizes,
  isPriority,
  className,
  studyCountClassName,
}: VideoCoverProps) {
  const isFree = isCourseFree(video);
  const isComingSoon = Boolean(video.isComingSoon);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <CourseCover
        image={video.image}
        isPriority={isPriority}
        sizes={sizes}
        studyCount={video.studyCount}
        studyCountClassName={studyCountClassName}
        className="aspect-video w-full"
      />
      {(isComingSoon || isFree) && (
        <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
          {isComingSoon && (
            <span className="rounded-full bg-black/75 px-2 py-0.5 text-xs font-semibold text-white">
              Sắp ra mắt
            </span>
          )}
          {isFree && (
            <span className="rounded-full bg-emerald-700 px-2 py-0.5 text-xs font-semibold text-white">
              Miễn phí
            </span>
          )}
        </div>
      )}
      {video.duration > 0 && (
        <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 text-xs font-medium tabular-nums text-white">
          {formatDurationMinutes(video.duration)}
        </span>
      )}
    </div>
  );
}
