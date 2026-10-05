import { ComingSoonPanel } from "../../../components";
import { EXPLORE_DEFAULT_FILTERS } from "../../../constants";
import {
  ExploreCoursesResult,
  ExploreFilters,
  ExploreLinkBase,
} from "../../../types";
import {
  buildExploreHref,
  getExploreTotalPages,
  hasActiveExploreFilters,
} from "../../../utils";
import { ExploreCourseCard } from "./explore-course-card";
import { ExploreNoResult } from "./explore-no-result";
import { ExplorePagination } from "./explore-pagination";
import { ExploreResultHeader } from "./explore-result-header";

interface ExploreResultsProps {
  result: ExploreCoursesResult;
  filters: ExploreFilters;
  linkBase: ExploreLinkBase;
}

export function ExploreResults({
  result,
  filters,
  linkBase,
}: ExploreResultsProps) {
  const { courses, total } = result;

  // Không lọc gì mà vẫn trống: chưa có khóa nào public
  if (total === 0 && !hasActiveExploreFilters(filters)) {
    return <ComingSoonPanel />;
  }

  // Lọc không ra khóa nào, hoặc ?trang= vượt quá số trang
  if (courses.length === 0) {
    return (
      <ExploreNoResult
        clearFiltersHref={buildExploreHref(linkBase, EXPLORE_DEFAULT_FILTERS)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <ExploreResultHeader
        total={total}
        filters={filters}
        linkBase={linkBase}
      />
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4 2xl:gap-6">
        {courses.map((course) => (
          <ExploreCourseCard key={course._id} course={course} />
        ))}
      </div>
      <ExplorePagination
        filters={filters}
        linkBase={linkBase}
        totalPages={getExploreTotalPages(total)}
      />
    </div>
  );
}
