import { CommentStatus } from "@/shared/constants/comment.constants";
import { useState } from "react";
import { toast } from "react-toastify";
import { COMMENT_STATUS_SAVE_ERROR_MESSAGE } from "../constants/comment-manage.constants";
import {
  CommentManageRow,
  CommentPendingChange,
  UpdateCommentsStatusResult,
} from "../types/comment-manage.types";

interface UseCommentModerationOptions {
  /** Gọi server (trang thật) hoặc giả lập (trang xem trước) */
  changeStatus: (
    commentIds: string[],
    status: CommentStatus,
  ) => Promise<UpdateCommentsStatusResult>;
}

function buildSuccessMessage(
  comments: CommentManageRow[],
  status: CommentStatus,
): string {
  const verb = status === CommentStatus.Approved ? "duyệt" : "từ chối";

  if (comments.length === 1) {
    return `Đã ${verb} bình luận của ${comments[0].author.name}`;
  }

  return `Đã ${verb} ${comments.length} bình luận`;
}

/**
 * Chọn dòng và đổi trạng thái. Duyệt, từ chối đều đổi lại được nên làm ngay,
 * không qua hộp xác nhận. Xong thì toast và bỏ chọn các dòng vừa đổi.
 */
export function useCommentModeration({
  changeStatus,
}: UseCommentModerationOptions) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pendingChange, setPendingChange] =
    useState<CommentPendingChange | null>(null);

  function handleToggleSelect(commentId: string) {
    setSelectedIds((currentIds) =>
      currentIds.includes(commentId)
        ? currentIds.filter((currentId) => currentId !== commentId)
        : [...currentIds, commentId],
    );
  }

  /** Đang chọn dòng nào (một phần hay hết) thì bỏ chọn hết, chưa chọn gì thì chọn cả trang */
  function handleToggleSelectAll(pageCommentIds: string[]) {
    setSelectedIds((currentIds) =>
      currentIds.length > 0 ? [] : pageCommentIds,
    );
  }

  function handleClearSelection() {
    setSelectedIds([]);
  }

  async function handleChangeStatus(
    comments: CommentManageRow[],
    status: CommentStatus,
  ) {
    if (pendingChange || comments.length === 0) return;

    const commentIds = comments.map((comment) => comment.id);

    setPendingChange({ commentIds, status });

    try {
      const result = await changeStatus(commentIds, status);

      if (!result.isSuccess) {
        toast.error(result.message || COMMENT_STATUS_SAVE_ERROR_MESSAGE);
        return;
      }

      toast.success(buildSuccessMessage(comments, status));
      setSelectedIds((currentIds) =>
        currentIds.filter((currentId) => !commentIds.includes(currentId)),
      );
    } catch {
      toast.error(COMMENT_STATUS_SAVE_ERROR_MESSAGE);
    } finally {
      setPendingChange(null);
    }
  }

  return {
    selectedIds,
    pendingChange,
    handleToggleSelect,
    handleToggleSelectAll,
    handleClearSelection,
    handleChangeStatus,
  };
}
