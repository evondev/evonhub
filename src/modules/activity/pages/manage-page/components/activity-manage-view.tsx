"use client";

import { LoadErrorState } from "@/shared/components/common";
import { ModerationToolbar } from "@/shared/components/moderation";
import { CourseFilterOption } from "@/shared/types";
import { useRef } from "react";
import { ACTIVITY_MANAGE_DEFAULT_FILTERS } from "../../../constants";
import {
  ActivityDateRange,
  ActivityManageFilters,
  ActivityManageResult,
  ActivityManageTab,
} from "../../../types";
import { buildActivityManageTabs } from "../../../utils";
import { ActivityDateFilter } from "./activity-date-filter";
import { ActivityList } from "./activity-list";
import { ActivityListSkeleton } from "./activity-list-skeleton";

export interface ActivityManageViewProps {
  filters: ActivityManageFilters;
  onFiltersChange: (changes: Partial<ActivityManageFilters>) => void;
  result?: ActivityManageResult;
  courses: CourseFilterOption[];
  pageSize: number;
  isLoading: boolean;
  isError: boolean;
  /** Đã có dòng trên màn, đang tải trang/bộ lọc mới */
  isRefreshing: boolean;
  onRetry: () => void;
}

const activityListId = "activity-manage-list";

export function ActivityManageView({
  filters,
  onFiltersChange,
  result,
  courses,
  pageSize,
  isLoading,
  isError,
  isRefreshing,
  onRetry,
}: ActivityManageViewProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  function handleTabChange(tab: ActivityManageTab) {
    onFiltersChange({ tab, page: 1 });
  }

  function handleCourseChange(courseId: string) {
    onFiltersChange({ courseId, page: 1 });
  }

  function handleDateRangeChange({ from, to }: ActivityDateRange) {
    onFiltersChange({ from, to, page: 1 });
  }

  function handleSearch(search: string) {
    if (search === filters.search) return;

    onFiltersChange({ search, page: 1 });
  }

  function handleSelectUser(email: string) {
    onFiltersChange({ search: email, page: 1 });
    window.scrollTo({ top: 0 });
  }

  function handlePageChange(page: number) {
    onFiltersChange({ page });
    window.scrollTo({ top: 0 });
  }

  // Gỡ từ khoá, khoá học và ngày, giữ tab đang xem
  function handleClearFilters() {
    onFiltersChange({
      search: ACTIVITY_MANAGE_DEFAULT_FILTERS.search,
      courseId: ACTIVITY_MANAGE_DEFAULT_FILTERS.courseId,
      from: ACTIVITY_MANAGE_DEFAULT_FILTERS.from,
      to: ACTIVITY_MANAGE_DEFAULT_FILTERS.to,
      page: 1,
    });
    searchInputRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-4">
      <ModerationToolbar
        tabs={buildActivityManageTabs(result?.tabCounts)}
        activeTab={filters.tab}
        search={filters.search}
        courses={courses}
        courseId={filters.courseId}
        searchPlaceholder="Tìm tên, username, email"
        searchLabel="Tìm hoạt động theo người"
        onTabChange={handleTabChange}
        onCourseChange={handleCourseChange}
        onSearch={handleSearch}
        searchInputRef={searchInputRef}
        controlsId={activityListId}
        collapseTabsBelow="xl"
        renderExtraFilter={(className) => (
          <ActivityDateFilter
            from={filters.from}
            to={filters.to}
            onChange={handleDateRangeChange}
            className={className}
          />
        )}
      />
      {isLoading && <ActivityListSkeleton />}
      {!isLoading && isError && (
        <LoadErrorState
          title="Chưa tải được nhật ký hoạt động"
          onRetry={onRetry}
        />
      )}
      {!isLoading && !isError && result && (
        <ActivityList
          id={activityListId}
          result={result}
          filters={filters}
          pageSize={pageSize}
          isRefreshing={isRefreshing}
          onPageChange={handlePageChange}
          onClearFilters={handleClearFilters}
          onSelectUser={handleSelectUser}
        />
      )}
    </div>
  );
}
