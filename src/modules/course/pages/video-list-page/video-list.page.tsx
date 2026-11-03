import { Suspense } from "react";
import { fetchVideoCategories } from "../../actions";
import { VIDEO_LIST_PATH } from "../../constants/video-list.constants";
import type { VideoListFilters, VideoListView } from "../../types";
import { withVideoListView } from "../../utils/video-list.utils";
import { VideoFilterBar } from "./components/video-filter-bar";
import { VideoListLoader } from "./components/video-list-loader";
import { VideoListSkeleton } from "./components/video-list-skeleton";

interface VideoListPageProps {
  filters: VideoListFilters;
  view: VideoListView;
}

export async function VideoListPage({ filters, view }: VideoListPageProps) {
  const linkBase = withVideoListView({ basePath: VIDEO_LIST_PATH }, view);
  // Truy vấn nhỏ: chờ luôn để thanh lọc hiện đủ chip, không nhảy khi chip tải xong
  const categories = await fetchVideoCategories();

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <VideoFilterBar
        filters={filters}
        linkBase={linkBase}
        categories={categories}
        view={view}
      />
      {/* key theo bộ lọc: đổi lọc thì phần kết quả hiện khung chờ, thanh lọc giữ nguyên.
          Kiểu xếp không nằm trong key: đổi kiểu thì kết quả cũ ở lại tới khi kiểu mới về */}
      <Suspense
        key={JSON.stringify(filters)}
        fallback={<VideoListSkeleton view={view} />}
      >
        <VideoListLoader filters={filters} linkBase={linkBase} view={view} />
      </Suspense>
    </div>
  );
}
