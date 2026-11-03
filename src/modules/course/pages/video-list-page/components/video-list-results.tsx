import {
  VIDEO_LIST_DEFAULT_FILTERS,
  VIDEO_LIST_PRIORITY_COUNT,
} from "../../../constants/video-list.constants";
import type {
  ExploreLinkBase,
  VideoListFilters,
  VideoListItem,
  VideoListView,
} from "../../../types";
import {
  buildVideoListHref,
  hasActiveVideoListFilters,
} from "../../../utils/video-list.utils";
import { VideoCard } from "../../../components";
import { VideoListEmpty } from "./video-list-empty";
import { VideoRow } from "./video-row";

interface VideoListResultsProps {
  videos: VideoListItem[];
  filters: VideoListFilters;
  linkBase: ExploreLinkBase;
  view: VideoListView;
}

export function VideoListResults({
  videos,
  filters,
  linkBase,
  view,
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
      {view === "grid" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4 2xl:gap-6">
          {videos.map((video, index) => (
            <VideoCard
              key={video._id}
              video={video}
              isPriority={index < VIDEO_LIST_PRIORITY_COUNT}
            />
          ))}
        </div>
      )}
      {/* Giới hạn bề rộng: hàng ngang trải hết màn rộng thì mô tả dài một dòng, khó đọc */}
      {view === "list" && (
        <ul className="flex max-w-5xl flex-col gap-3">
          {videos.map((video, index) => (
            <li key={video._id}>
              <VideoRow
                video={video}
                isPriority={index < VIDEO_LIST_PRIORITY_COUNT}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
