import type { ExploreLinkBase, VideoListFilters } from "../../../types";
import { buildVideoListHref } from "../../../utils/video-list.utils";
import { ExploreFilterChip } from "../../explore-page/components/explore-filter-chip";
import { ExploreSearchInput } from "../../explore-page/components/explore-search-input";

interface VideoFilterBarProps {
  filters: VideoListFilters;
  linkBase: ExploreLinkBase;
}

/** Ô tìm và chip "Miễn phí", dính dưới header khi cuộn như trang Khóa học */
export function VideoFilterBar({ filters, linkBase }: VideoFilterBarProps) {
  const freeToggleHref = buildVideoListHref(linkBase, {
    ...filters,
    isFree: !filters.isFree,
  });

  return (
    <div className="sticky top-16 z-10 -mx-4 flex flex-col gap-3 bg-background px-4 py-3 sm:-mx-6 sm:flex-row sm:items-center sm:px-6 lg:top-20 lg:-ml-6 lg:-mr-4 lg:pl-6 lg:pr-4">
      <div className="min-w-0 sm:flex-1 lg:flex-none">
        <ExploreSearchInput
          defaultValue={filters.search}
          placeholder="Tìm video"
        />
      </div>
      <div className="flex gap-2">
        <ExploreFilterChip
          label="Miễn phí"
          href={freeToggleHref}
          isActive={filters.isFree}
        />
      </div>
    </div>
  );
}
