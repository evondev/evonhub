"use client";

import { LoadErrorState } from "@/shared/components/common";
import {
  ModerationListSkeleton,
  ModerationToolbar,
  PurgeRejectedDialog,
} from "@/shared/components/moderation";
import { CommentStatus } from "@/shared/constants/comment.constants";
import { ModerationState, PurgeRejectedState } from "@/shared/hooks";
import { CourseFilterOption } from "@/shared/types";
import { useRef } from "react";
import { COMMENT_MANAGE_DEFAULT_FILTERS } from "../../../constants/comment-manage.constants";
import {
  CommentManageFilters,
  CommentManageResult,
  CommentManageRow,
  CommentManageTab,
} from "../../../types/comment-manage.types";
import { buildCommentManageTabs } from "../../../utils/comment-manage.utils";
import { CommentList } from "./comment-list";

export interface CommentManageViewProps {
  filters: CommentManageFilters;
  onFiltersChange: (changes: Partial<CommentManageFilters>) => void;
  result?: CommentManageResult;
  courses: CourseFilterOption[];
  pageSize: number;
  isLoading: boolean;
  isError: boolean;
  /** Đã có dòng trên màn, đang tải trang/bộ lọc mới */
  isRefreshing: boolean;
  onRetry: () => void;
  moderation: ModerationState<CommentManageRow>;
  purge: PurgeRejectedState;
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
  moderation,
  purge,
}: CommentManageViewProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Đổi bộ lọc hay trang là danh sách khác: bỏ chọn, kẻo duyệt nhầm dòng đã khuất
  function changeFilters(changes: Partial<CommentManageFilters>) {
    moderation.handleClearSelection();
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
      <ModerationToolbar
        tabs={buildCommentManageTabs(result?.tabCounts)}
        activeTab={filters.tab}
        search={filters.search}
        courses={courses}
        courseId={filters.courseId}
        searchPlaceholder="Tìm trong nội dung bình luận"
        searchLabel="Tìm bình luận"
        onTabChange={handleTabChange}
        onCourseChange={handleCourseChange}
        onSearch={handleSearch}
        searchInputRef={searchInputRef}
        controlsId={commentListId}
      />
      {isLoading && <ModerationListSkeleton label="Bình luận" />}
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
          moderation={moderation}
          onPageChange={handlePageChange}
          onClearFilters={handleClearFilters}
          onPurgeRejected={purge.handleOpenConfirm}
        />
      )}
      <PurgeRejectedDialog
        isOpen={purge.isConfirmOpen}
        count={result?.tabCounts[CommentStatus.Rejected] || 0}
        itemLabel="bình luận"
        consequence="Các câu trả lời bên dưới chúng cũng bị xoá theo."
        isPurging={purge.isPurging}
        onConfirm={purge.handleConfirm}
        onCancel={purge.handleCancel}
      />
    </div>
  );
}
