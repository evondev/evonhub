import { COURSE_LEVEL_LABELS } from "@/shared/constants/course.constants";
import { EXPLORE_LEVEL_OPTIONS } from "../../../constants";
import { ExploreFilters, ExploreLinkBase } from "../../../types";
import { buildExploreHref } from "../../../utils";
import { ExploreFilterChip } from "./explore-filter-chip";
import { ExploreSearchInput } from "./explore-search-input";

interface ExploreFilterBarProps {
  filters: ExploreFilters;
  linkBase: ExploreLinkBase;
}

/** Ô tìm và chip lọc, dính dưới header khi cuộn */
export function ExploreFilterBar({ filters, linkBase }: ExploreFilterBarProps) {
  const freeToggleHref = buildExploreHref(linkBase, {
    ...filters,
    isFree: !filters.isFree,
    page: 1,
  });

  return (
    <div className="sticky top-16 z-10 -mx-4 flex flex-col gap-3 bg-background px-4 py-3 sm:-mx-6 sm:px-6 lg:top-20 lg:-ml-6 lg:-mr-4 lg:flex-row lg:items-center lg:pl-6 lg:pr-4">
      <ExploreSearchInput defaultValue={filters.search} />
      {/* Điện thoại: hàng chip cuộn ngang, mép phải mờ dần báo còn chip */}
      <div className="scroll-hidden -mr-4 flex gap-2 overflow-x-auto pr-4 [mask-image:linear-gradient(to_right,black_85%,transparent)] sm:mr-0 sm:pr-0 sm:[mask-image:none]">
        <ExploreFilterChip
          label="Miễn phí"
          href={freeToggleHref}
          isActive={filters.isFree}
        />
        <span
          aria-hidden="true"
          className="my-1 w-px shrink-0 bg-border-strong"
        />
        {EXPLORE_LEVEL_OPTIONS.map((option) => {
          const isActive = filters.level === option.level;

          return (
            <ExploreFilterChip
              key={option.slug}
              label={COURSE_LEVEL_LABELS[option.level]}
              href={buildExploreHref(linkBase, {
                ...filters,
                level: isActive ? undefined : option.level,
                page: 1,
              })}
              isActive={isActive}
            />
          );
        })}
      </div>
    </div>
  );
}
