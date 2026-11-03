import type {
  ExploreLinkBase,
  VideoCategoryOption,
  VideoListFilters,
} from "../../../types";
import { buildVideoListHref } from "../../../utils/video-list.utils";
import { ExploreFilterChip } from "../../explore-page/components/explore-filter-chip";
import { ExploreSearchInput } from "../../explore-page/components/explore-search-input";

interface VideoFilterBarProps {
  filters: VideoListFilters;
  linkBase: ExploreLinkBase;
  /** Chỉ các danh mục đang có video, để chip nào bấm vào cũng ra kết quả */
  categories: VideoCategoryOption[];
}

/** Ô tìm, chip "Miễn phí" và chip danh mục, dính dưới header khi cuộn như trang Khóa học */
export function VideoFilterBar({
  filters,
  linkBase,
  categories,
}: VideoFilterBarProps) {
  const freeToggleHref = buildVideoListHref(linkBase, {
    ...filters,
    isFree: !filters.isFree,
  });

  return (
    // Bố cục như thanh lọc trang Khóa học: ô tìm và hàng chip xếp dọc, từ lg nằm một hàng
    <div className="sticky top-16 z-10 -mx-4 flex flex-col gap-3 bg-background px-4 py-3 sm:-mx-6 sm:px-6 lg:top-20 lg:-ml-6 lg:-mr-4 lg:flex-row lg:items-center lg:pl-6 lg:pr-4">
      <ExploreSearchInput
        defaultValue={filters.search}
        placeholder="Tìm video"
      />
      {/* Nhiều danh mục thì cuộn ngang thay vì xuống dòng, mép phải mờ dần báo còn chip */}
      <div className="scroll-hidden -mr-4 flex min-w-0 gap-2 overflow-x-auto pr-4 [mask-image:linear-gradient(to_right,black_85%,transparent)] sm:mr-0 sm:pr-0 lg:flex-1">
        <ExploreFilterChip
          label="Miễn phí"
          href={freeToggleHref}
          isActive={filters.isFree}
        />
        {categories.length > 0 && (
          <span
            aria-hidden="true"
            className="my-1 w-px shrink-0 bg-border-strong"
          />
        )}
        {categories.map((category) => {
          const isActive = filters.categorySlug === category.slug;

          return (
            <ExploreFilterChip
              key={category.slug}
              label={category.name}
              // Bấm lại chip đang bật là bỏ lọc danh mục
              href={buildVideoListHref(linkBase, {
                ...filters,
                categorySlug: isActive ? "" : category.slug,
              })}
              isActive={isActive}
            />
          );
        })}
      </div>
    </div>
  );
}
