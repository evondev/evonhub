import { LoadErrorState, PreviewStateSwitcher } from "@/shared/components/common";
import {
  PREVIEW_VIDEO_CATEGORIES,
  PREVIEW_VIDEO_LIST_STATE_LINKS,
  VIDEO_LIST_PREVIEW_PATH,
} from "../../constants/video-list.constants";
import type {
  VideoListFilters,
  VideoListPreviewState,
  VideoListView,
} from "../../types";
import {
  buildPreviewVideoList,
  getPreviewVideoListFilters,
  withVideoListView,
} from "../../utils/video-list.utils";
import { VideoFilterBar } from "./components/video-filter-bar";
import { VideoListResults } from "./components/video-list-results";
import { VideoListSkeleton } from "./components/video-list-skeleton";

interface VideoListPreviewPageProps {
  state: VideoListPreviewState;
  filters: VideoListFilters;
  view: VideoListView;
}

/** Trang xem trước danh sách video bằng video giả. Không đọc DB, route chỉ mở ở dev */
export function VideoListPreviewPage({
  state,
  filters,
  view,
}: VideoListPreviewPageProps) {
  const linkBase = withVideoListView(
    { basePath: VIDEO_LIST_PREVIEW_PATH, fixedParams: { tt: state } },
    view,
  );
  const shownFilters = getPreviewVideoListFilters(state, filters);

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <PreviewStateSwitcher
        links={PREVIEW_VIDEO_LIST_STATE_LINKS}
        currentState={state}
      />
      <VideoFilterBar
        filters={shownFilters}
        linkBase={linkBase}
        categories={PREVIEW_VIDEO_CATEGORIES}
        view={view}
      />
      {state === "dang-tai" && <VideoListSkeleton view={view} />}
      {state === "loi" && (
        <LoadErrorState title="Chưa tải được danh sách video" />
      )}
      {state !== "dang-tai" && state !== "loi" && (
        <VideoListResults
          videos={buildPreviewVideoList(state, shownFilters)}
          filters={shownFilters}
          linkBase={linkBase}
          view={view}
        />
      )}
    </div>
  );
}
