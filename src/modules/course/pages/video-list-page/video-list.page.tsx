import { Suspense } from "react";
import { VIDEO_LIST_PATH } from "../../constants/video-list.constants";
import type { ExploreLinkBase, VideoListFilters } from "../../types";
import { VideoFilterBar } from "./components/video-filter-bar";
import { VideoListLoader } from "./components/video-list-loader";
import { VideoListSkeleton } from "./components/video-list-skeleton";

interface VideoListPageProps {
  filters: VideoListFilters;
}

const videoListLinkBase: ExploreLinkBase = { basePath: VIDEO_LIST_PATH };

export function VideoListPage({ filters }: VideoListPageProps) {
  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <VideoFilterBar filters={filters} linkBase={videoListLinkBase} />
      {/* key theo bộ lọc: đổi lọc thì phần kết quả hiện khung chờ, thanh lọc giữ nguyên */}
      <Suspense key={JSON.stringify(filters)} fallback={<VideoListSkeleton />}>
        <VideoListLoader filters={filters} linkBase={videoListLinkBase} />
      </Suspense>
    </div>
  );
}
