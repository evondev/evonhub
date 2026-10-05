"use client";

import { LoadErrorState } from "@/shared/components/common";
import {
  ModerationListSkeleton,
  ModerationToolbar,
  PurgeRejectedDialog,
} from "@/shared/components/moderation";
import { RatingStatus } from "@/shared/constants/rating.constants";
import { ModerationState, PurgeRejectedState } from "@/shared/hooks";
import { CourseFilterOption } from "@/shared/types";
import { useRef } from "react";
import { RATING_MANAGE_DEFAULT_FILTERS } from "../../../constants/rating-manage.constants";
import {
  RatingManageFilters,
  RatingManageResult,
  RatingManageRow,
  RatingManageTab,
} from "../../../types/rating-manage.types";
import { buildRatingManageTabs } from "../../../utils/rating-manage.utils";
import { RatingList } from "./rating-list";

export interface RatingManageViewProps {
  filters: RatingManageFilters;
  onFiltersChange: (changes: Partial<RatingManageFilters>) => void;
  result?: RatingManageResult;
  courses: CourseFilterOption[];
  pageSize: number;
  isLoading: boolean;
  isError: boolean;
  /** Đã có dòng trên màn, đang tải trang/bộ lọc mới */
  isRefreshing: boolean;
  onRetry: () => void;
  moderation: ModerationState<RatingManageRow>;
  purge: PurgeRejectedState;
}

const ratingListId = "rating-manage-list";

export function RatingManageView({
  filters,
  onFiltersChange,
  result,
  courses,
  pageSize,
  isLoading,
  isError,
  isRefreshing,
  onRetry,
  moderation,
  purge,
}: RatingManageViewProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Đổi bộ lọc hay trang là danh sách khác: bỏ chọn, kẻo duyệt nhầm dòng đã khuất
  function changeFilters(changes: Partial<RatingManageFilters>) {
    moderation.handleClearSelection();
    onFiltersChange(changes);
  }

  function handleTabChange(tab: RatingManageTab) {
    changeFilters({ tab, page: 1 });
  }

  function handleCourseChange(courseId: string) {
    changeFilters({ courseId, page: 1 });
  }

  function handleSearch(search: string) {
    if (search === filters.search) return;

    changeFilters({ search, page: 1 });
  }

  function handlePageChange(page: number) {
    changeFilters({ page });
    window.scrollTo({ top: 0 });
  }

  // Gỡ từ khoá và khoá học, giữ tab đang xem
  function handleClearFilters() {
    changeFilters({
      search: RATING_MANAGE_DEFAULT_FILTERS.search,
      courseId: RATING_MANAGE_DEFAULT_FILTERS.courseId,
      page: 1,
    });
    searchInputRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-4">
      <ModerationToolbar
        tabs={buildRatingManageTabs(result?.tabCounts)}
        activeTab={filters.tab}
        search={filters.search}
        courses={courses}
        courseId={filters.courseId}
        searchPlaceholder="Tìm trong nội dung nhận xét"
        searchLabel="Tìm đánh giá"
        onTabChange={handleTabChange}
        onCourseChange={handleCourseChange}
        onSearch={handleSearch}
        searchInputRef={searchInputRef}
        controlsId={ratingListId}
      />
      {isLoading && <ModerationListSkeleton label="Đánh giá" />}
      {!isLoading && isError && (
        <LoadErrorState
          title="Chưa tải được danh sách đánh giá"
          onRetry={onRetry}
        />
      )}
      {!isLoading && !isError && result && (
        <RatingList
          id={ratingListId}
          result={result}
          filters={filters}
          pageSize={pageSize}
          isRefreshing={isRefreshing}
          moderation={moderation}
          onPageChange={handlePageChange}
          onClearFilters={handleClearFilters}
          onPurgeRejected={purge.handleOpenConfirm}
        />
      )}
      <PurgeRejectedDialog
        isOpen={purge.isConfirmOpen}
        count={result?.tabCounts[RatingStatus.Rejected] || 0}
        itemLabel="đánh giá"
        consequence="Người viết sẽ đánh giá lại được khoá đó."
        isPurging={purge.isPurging}
        onConfirm={purge.handleConfirm}
        onCancel={purge.handleCancel}
      />
    </div>
  );
}
