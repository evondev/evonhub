import { CourseCover } from "@/shared/components/course";
import { cn } from "@/shared/utils";
import type { VideoListItem } from "../../../types";
import { formatDurationMinutes, isCourseFree } from "../../../utils";

interface VideoCoverProps {
  video: VideoListItem;
  sizes: string;
  isPriority: boolean;
  className?: string;
}

/** Ảnh bìa video kèm "Miễn phí" ở góc trên và thời lượng ở góc dưới, để lướt là thấy */
export function VideoCover({
  video,
  sizes,
  isPriority,
  className,
}: VideoCoverProps) {
  const isFree = isCourseFree(video);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <CourseCover
        image={video.image}
        isPriority={isPriority}
        sizes={sizes}
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
  );
}
