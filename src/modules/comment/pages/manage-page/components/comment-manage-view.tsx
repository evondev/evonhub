"use client";

import { LoadErrorState } from "@/shared/components/common";
import { CommentStatus } from "@/shared/constants/comment.constants";
import { useRef } from "react";
import { COMMENT_MANAGE_DEFAULT_FILTERS } from "../../../constants/comment-manage.constants";
import {
  CommentCourseOption,
  CommentManageFilters,
  CommentManageResult,
  CommentManageRow,
  CommentManageTab,
  CommentPendingChange,
} from "../../../types/comment-manage.types";
import { buildCommentManageTabs } from "../../../utils/comment-manage.utils";
import { CommentList } from "./comment-list";
import { CommentListSkeleton } from "./comment-list-skeleton";
import { CommentManageToolbar } from "./comment-manage-toolbar";

export interface CommentManageViewProps {
  filters: CommentManageFilters;
  onFiltersChange: (changes: Partial<CommentManageFilters>) => void;
  result?: CommentManageResult;
  courses: CommentCourseOption[];
  pageSize: number;
  isLoading: boolean;
  isError: boolean;
  /** Đã có dòng trên màn, đang tải trang/bộ lọc mới */
  isRefreshing: boolean;
  onRetry: () => void;
  selectedIds: string[];
  pendingChange: CommentPendingChange | null;
  onToggleSelect: (commentId: string) => void;
  onToggleSelectAll: (pageCommentIds: string[]) => void;
  onClearSelection: () => void;
  onChangeStatus: (comments: CommentManageRow[], status: CommentStatus) => void;
}

const commentListId = "comment-manage-list";

export function CommentManageView({
  filters,
  onFiltersChange,
  result,
  courses,
  pageSize,
  isLoading,
  isError,
  isRefreshing,
  onRetry,
  selectedIds,
  pendingChange,
  onToggleSelect,
  onToggleSelectAll,
  onClearSelection,
  onChangeStatus,
}: CommentManageViewProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Đổi bộ lọc hay trang là danh sách khác: bỏ chọn, kẻo duyệt nhầm dòng đã khuất
  function changeFilters(changes: Partial<CommentManageFilters>) {
    onClearSelection();
    onFiltersChange(changes);
  }

  function handleTabChange(tab: CommentManageTab) {
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
      search: COMMENT_MANAGE_DEFAULT_FILTERS.search,
      courseId: COMMENT_MANAGE_DEFAULT_FILTERS.courseId,
      page: 1,
    });
    searchInputRef.current?.focus();
  }

  return (
    <div className="flex flex-col gap-4">
      <CommentManageToolbar
        filters={filters}
        tabs={buildCommentManageTabs(result?.tabCounts)}
        courses={courses}
        onTabChange={handleTabChange}
        onCourseChange={handleCourseChange}
        onSearch={handleSearch}
        searchInputRef={searchInputRef}
        controlsId={commentListId}
      />
      {isLoading && <CommentListSkeleton />}
      {!isLoading && isError && (
        <LoadErrorState
          title="Chưa tải được danh sách bình luận"
          onRetry={onRetry}
        />
      )}
      {!isLoading && !isError && result && (
        <CommentList
          id={commentListId}
          result={result}
          filters={filters}
          pageSize={pageSize}
          isRefreshing={isRefreshing}
          selectedIds={selectedIds}
          pendingChange={pendingChange}
          onToggleSelect={onToggleSelect}
          onToggleSelectAll={onToggleSelectAll}
          onClearSelection={onClearSelection}
          onChangeStatus={onChangeStatus}
          onPageChange={handlePageChange}
          onClearFilters={handleClearFilters}
        />
      )}
    </div>
  );
}
