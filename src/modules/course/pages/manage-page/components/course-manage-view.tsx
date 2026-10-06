"use client";

import { LoadErrorState } from "@/shared/components/common";
import { useRef } from "react";
import { COURSE_MANAGE_DEFAULT_FILTERS } from "../../../constants/course-manage.constants";
import {
  CourseManageFilters,
  CourseManageResult,
  CourseManageTab,
} from "../../../types/course-manage.types";
import { buildCourseManageTabs } from "../../../utils/course-manage.utils";
import { CourseManageToolbar } from "./course-manage-toolbar";
import { CourseTable } from "./course-table";
import { CourseTableSkeleton } from "./course-table-skeleton";

export interface CourseManageViewProps {
  filters: CourseManageFilters;
  onFiltersChange: (changes: Partial<CourseManageFilters>) => void;
  result?: CourseManageResult;
  pageSize: number;
  isLoading: boolean;
  isError: boolean;
  /** Đã có dòng trên màn, đang tải trang/bộ lọc mới */
  isRefreshing: boolean;
  onRetry: () => void;
}

const courseTableId = "course-manage-table";

export function CourseManageView({
  filters,
  onFiltersChange,
  result,
  pageSize,
  isLoading,
  isError,
  isRefreshing,
  onRetry,
}: CourseManageViewProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  function handleTabChange(tab: CourseManageTab) {
    onFiltersChange({ tab, page: 1 });
  }

  function handleFreeToggle() {
    onFiltersChange({ isFree: !filters.isFree, page: 1 });
  }

  function handleSearch(search: string) {
    if (search === filters.search) return;

    onFiltersChange({ search, page: 1 });
  }

  function handlePageChange(page: number) {
    onFiltersChange({ page });
    window.scrollTo({ top: 0 });
  }

  function handleClearFilters() {
    onFiltersChange(COURSE_MANAGE_DEFAULT_FILTERS);
    searchInputRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Tab "Khóa học" của thanh quản lý đã là tên trang cho mắt; h1 cho trình đọc màn hình */}
      <h1 className="sr-only">Quản lý khóa học</h1>
      <CourseManageToolbar
        filters={filters}
        tabs={buildCourseManageTabs(result?.tabCounts)}
        onTabChange={handleTabChange}
        onFreeToggle={handleFreeToggle}
        onSearch={handleSearch}
        searchInputRef={searchInputRef}
        controlsId={courseTableId}
      />
      {isLoading && <CourseTableSkeleton />}
      {!isLoading && isError && (
        <LoadErrorState
          title="Chưa tải được danh sách khóa học"
          onRetry={onRetry}
        />
      )}
      {!isLoading && !isError && result && (
        <CourseTable
          id={courseTableId}
          result={result}
          filters={filters}
          pageSize={pageSize}
          isRefreshing={isRefreshing}
          onPageChange={handlePageChange}
          onClearFilters={handleClearFilters}
        />
      )}
    </div>
  );
}
