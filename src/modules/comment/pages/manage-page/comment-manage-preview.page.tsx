"use client";

import { PreviewStateSwitcher } from "@/shared/components/common";
import { CommentStatus } from "@/shared/constants/comment.constants";
import { ITEMS_PER_PAGE } from "@/shared/constants/common.constants";
import { useState } from "react";
import {
  COMMENT_MANAGE_DEFAULT_FILTERS,
  COMMENT_MANAGE_PREVIEW_EMPTY_KEYWORD,
  COMMENT_MANAGE_PREVIEW_SAVE_DELAY_MS,
  COMMENT_MANAGE_PREVIEW_STATE_LINKS,
  COMMENT_MANAGE_PREVIEW_TAB_COUNTS,
  PREVIEW_COMMENT_COURSES,
  PREVIEW_MANAGED_COMMENTS,
} from "../../constants/comment-manage.constants";
import { useCommentModeration } from "../../hooks/use-comment-moderation";
import {
  CommentManageFilters,
  CommentManagePreviewState,
  UpdateCommentsStatusResult,
} from "../../types/comment-manage.types";
import {
  countPreviewCommentTabs,
  filterPreviewComments,
} from "../../utils/comment-manage.utils";
import { CommentManageView } from "./components";

interface CommentManagePreviewPageProps {
  state: CommentManagePreviewState;
}

const previewCourseTitleById = Object.fromEntries(
  PREVIEW_COMMENT_COURSES.map((course) => [course.id, course.title]),
);

/** Trang xem trước "Quản lý bình luận" bằng bình luận giả. Không đọc DB, chỉ mở ở dev */
export function CommentManagePreviewPage({
  state,
}: CommentManagePreviewPageProps) {
  const [filters, setFilters] = useState<CommentManageFilters>({
    ...COMMENT_MANAGE_DEFAULT_FILTERS,
    search: state === "rong" ? COMMENT_MANAGE_PREVIEW_EMPTY_KEYWORD : "",
  });
  // "Hết hàng chờ": mọi bình luận đã được xử lý
  const [previewComments, setPreviewComments] = useState(() =>
    state === "het-cho"
      ? PREVIEW_MANAGED_COMMENTS.filter(
          (comment) => comment.status !== CommentStatus.Pending,
        )
      : PREVIEW_MANAGED_COMMENTS,
  );
  const matchedComments = filterPreviewComments(
    previewComments,
    filters,
    previewCourseTitleById,
  );
  const hasNarrowingFilters = Boolean(filters.search || filters.courseId);
  const hasChangedComments = previewComments !== PREVIEW_MANAGED_COMMENTS;
  // Chưa tìm, chưa lọc, chưa đổi gì thì giả như đang xem cả danh sách thật
  const tabCounts =
    hasNarrowingFilters || hasChangedComments
      ? countPreviewCommentTabs(
          previewComments,
          filters,
          previewCourseTitleById,
        )
      : COMMENT_MANAGE_PREVIEW_TAB_COUNTS;

  function handleFiltersChange(changes: Partial<CommentManageFilters>) {
    setFilters((currentFilters) => ({ ...currentFilters, ...changes }));
  }

  // Giả lập server: chờ một nhịp rồi đổi trạng thái trên danh sách giả
  async function changePreviewStatus(
    commentIds: string[],
    status: CommentStatus,
  ): Promise<UpdateCommentsStatusResult> {
    await new Promise((resolve) =>
      setTimeout(resolve, COMMENT_MANAGE_PREVIEW_SAVE_DELAY_MS),
    );

    setPreviewComments((currentComments) =>
      currentComments.map((comment) =>
        commentIds.includes(comment.id) ? { ...comment, status } : comment,
      ),
    );

    return { isSuccess: true };
  }

  const moderation = useCommentModeration({
    changeStatus: changePreviewStatus,
  });

  function handleRetry() {}

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <PreviewStateSwitcher
        links={COMMENT_MANAGE_PREVIEW_STATE_LINKS}
        currentState={state}
      />
      <CommentManageView
        filters={filters}
        onFiltersChange={handleFiltersChange}
        result={{
          comments: matchedComments.slice(0, ITEMS_PER_PAGE),
          total: tabCounts[filters.tab],
          tabCounts,
        }}
        courses={PREVIEW_COMMENT_COURSES}
        pageSize={ITEMS_PER_PAGE}
        isLoading={state === "dang-tai"}
        isError={state === "loi"}
        isRefreshing={false}
        onRetry={handleRetry}
        selectedIds={moderation.selectedIds}
        pendingChange={moderation.pendingChange}
        onToggleSelect={moderation.handleToggleSelect}
        onToggleSelectAll={moderation.handleToggleSelectAll}
        onClearSelection={moderation.handleClearSelection}
        onChangeStatus={moderation.handleChangeStatus}
      />
    </div>
  );
}
