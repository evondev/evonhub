"use client";

import { PreviewStateSwitcher } from "@/shared/components/common";
import { ITEMS_PER_PAGE } from "@/shared/constants/common.constants";
import { useState } from "react";
import {
  COURSE_MANAGE_DEFAULT_FILTERS,
  COURSE_MANAGE_PREVIEW_EMPTY_KEYWORD,
  COURSE_MANAGE_PREVIEW_STATE_LINKS,
  COURSE_MANAGE_PREVIEW_TAB_COUNTS,
  PREVIEW_MANAGED_COURSES,
} from "../../constants/course-manage.constants";
import {
  CourseManageFilters,
  CourseManagePreviewState,
} from "../../types/course-manage.types";
import {
  countPreviewCourseTabs,
  filterPreviewCourses,
} from "../../utils/course-manage.utils";
import { CourseManageView } from "./components";

interface CourseManagePreviewPageProps {
  state: CourseManagePreviewState;
}

/** Trang xem trước "Quản lý khóa học" bằng khóa học giả. Không đọc DB, chỉ mở ở dev */
export function CourseManagePreviewPage({
  state,
}: CourseManagePreviewPageProps) {
  const [filters, setFilters] = useState<CourseManageFilters>({
    ...COURSE_MANAGE_DEFAULT_FILTERS,
    search: state === "rong" ? COURSE_MANAGE_PREVIEW_EMPTY_KEYWORD : "",
  });
  const matchedCourses = filterPreviewCourses(PREVIEW_MANAGED_COURSES, filters);
  const hasNarrowingFilters = Boolean(filters.search) || filters.isFree;
  // Không tìm, không lọc miễn phí thì giả như đang xem cả danh sách thật
  const tabCounts = hasNarrowingFilters
    ? countPreviewCourseTabs(PREVIEW_MANAGED_COURSES, filters)
    : COURSE_MANAGE_PREVIEW_TAB_COUNTS;

  function handleFiltersChange(changes: Partial<CourseManageFilters>) {
    setFilters((currentFilters) => ({ ...currentFilters, ...changes }));
  }

  function handleRetry() {}

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PreviewStateSwitcher
        links={COURSE_MANAGE_PREVIEW_STATE_LINKS}
        currentState={state}
      />
      <CourseManageView
        filters={filters}
        onFiltersChange={handleFiltersChange}
        result={{
          courses: matchedCourses.slice(0, ITEMS_PER_PAGE),
          total: tabCounts[filters.tab],
          tabCounts,
        }}
        pageSize={ITEMS_PER_PAGE}
        isLoading={state === "dang-tai"}
        isError={state === "loi"}
        isRefreshing={false}
        onRetry={handleRetry}
      />
    </div>
  );
}
