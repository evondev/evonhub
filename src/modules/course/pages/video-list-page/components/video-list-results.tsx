import {
  VIDEO_LIST_DEFAULT_FILTERS,
  VIDEO_LIST_PRIORITY_COUNT,
} from "../../../constants/video-list.constants";
import type {
  ExploreLinkBase,
  VideoListFilters,
  VideoListItem,
} from "../../../types";
import {
  buildVideoListHref,
  hasActiveVideoListFilters,
} from "../../../utils/video-list.utils";
import { VideoCard } from "./video-card";
import { VideoListEmpty } from "./video-list-empty";

interface VideoListResultsProps {
  videos: VideoListItem[];
  filters: VideoListFilters;
  linkBase: ExploreLinkBase;
}

export function VideoListResults({
  videos,
  filters,
  linkBase,
}: VideoListResultsProps) {
  if (videos.length === 0) {
    const clearFiltersHref = hasActiveVideoListFilters(filters)
      ? buildVideoListHref(linkBase, VIDEO_LIST_DEFAULT_FILTERS)
      : undefined;

    return <VideoListEmpty clearFiltersHref={clearFiltersHref} />;
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <p className="text-sm text-muted" aria-live="polite">
        <span className="font-semibold tabular-nums text-foreground">
          {videos.length}
        </span>{" "}
        video · mới nhất trước
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4 2xl:gap-6">
        {videos.map((video, index) => (
          <VideoCard
            key={video._id}
            video={video}
            isPriority={index < VIDEO_LIST_PRIORITY_COUNT}
          />
        ))}
      </div>
    </div>
  );
}
