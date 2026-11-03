import { VideoCard } from "@/modules/course/components";
import { VIDEO_LIST_PATH } from "@/modules/course/constants/video-list.constants";
import type { VideoListItem } from "@/modules/course/types";
import { LoadErrorState } from "@/shared/components/common";
import { Clapperboard } from "lucide-react";
import { VIDEO_RAIL_SUBTITLE } from "../constants";
import { getVideoRailItemClassName } from "../utils";
import { SectionHeading } from "./section-heading";

interface VideoRailSectionProps {
  /** undefined là đọc lỗi */
  videos?: VideoListItem[];
}

/** Khối "Video ngắn" của dashboard: một hàng video mới nhất, điện thoại cuộn ngang */
export function VideoRailSection({ videos }: VideoRailSectionProps) {
  return (
    <section className="flex min-w-0 flex-col gap-4">
      <SectionHeading
        title="Video ngắn"
        subtitle={VIDEO_RAIL_SUBTITLE}
        linkText="Xem tất cả video"
        linkHref={VIDEO_LIST_PATH}
      />
      {!videos && <LoadErrorState title="Chưa tải được video" />}
      {videos?.length === 0 && (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface px-6 py-10 text-center">
          <span className="grid size-10 place-items-center rounded-xl bg-foreground/5 text-muted">
            <Clapperboard className="size-5" />
          </span>
          <p className="text-sm font-semibold text-foreground">
            Video ngắn sắp có
          </p>
          <p className="max-w-sm text-pretty text-sm text-muted">
            Mỗi video một chủ đề lập trình, có video xem miễn phí.
          </p>
        </div>
      )}
      {videos && videos.length > 0 && (
        <ul className="-mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 scrollbar-auto-hide sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-3 2xl:grid-cols-4">
          {videos.map((video, index) => (
            <li key={video._id} className={getVideoRailItemClassName(index)}>
              <VideoCard video={video} isPriority={index < 3} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
