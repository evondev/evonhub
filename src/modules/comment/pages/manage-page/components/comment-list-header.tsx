import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CommentStatus } from "@/shared/constants/comment.constants";
import { cn } from "@/shared/utils";
import { Check, X } from "lucide-react";
import { CHECKBOX_HIT_AREA_CLASS_NAME } from "../../../constants/comment-manage.constants";
import {
  CommentManageRow,
  CommentPendingChange,
} from "../../../types/comment-manage.types";

interface CommentListHeaderProps {
  pageComments: CommentManageRow[];
  selectedComments: CommentManageRow[];
  pendingChange: CommentPendingChange | null;
  onToggleSelectAll: () => void;
  onClearSelection: () => void;
  onChangeStatus: (comments: CommentManageRow[], status: CommentStatus) => void;
}

// Dưới sm bỏ icon, nút sát lại: một hàng 375px vừa "Đã chọn 10 · Bỏ chọn" và hai nút
const bulkButtonClassName =
  "h-9 whitespace-nowrap rounded-lg px-2.5 sm:h-8 sm:px-3";

// Gói một khối để lúc lưu nút giữ nguyên bề rộng (xem comment-row-actions)
const bulkContentClassName = "inline-flex items-center gap-1.5";

/**
 * Hàng đầu danh sách: chọn cả trang. Có dòng được chọn thì chính hàng này thành
 * thanh hàng loạt, cùng chiều cao, danh sách bên dưới không xô
 */
export function CommentListHeader({
  pageComments,
  selectedComments,
  pendingChange,
  onToggleSelectAll,
  onClearSelection,
  onChangeStatus,
}: CommentListHeaderProps) {
  const hasComments = pageComments.length > 0;
  const selectedCount = selectedComments.length;
  const hasSelection = selectedCount > 0;
  const isAllSelected = hasComments && selectedCount === pageComments.length;
  const canApprove = selectedComments.some(
    (comment) => comment.status !== CommentStatus.Approved,
  );
  const canReject = selectedComments.some(
    (comment) => comment.status !== CommentStatus.Rejected,
  );
  // Nút hàng loạt chỉ quay khi thao tác đang chạy đúng là trên các dòng đã chọn
  const isBulkChanging =
    hasSelection &&
    pendingChange?.commentIds.length === selectedCount &&
    selectedComments.every((comment) =>
      pendingChange.commentIds.includes(comment.id),
    );

  function getSelectAllState() {
    if (isAllSelected) return true;
    if (hasSelection) return "indeterminate";

    return false;
  }

  return (
    // Đang chọn thì hàng này dính ngay dưới header: chọn dòng ở cuối trang vẫn
    // thấy nút duyệt hàng loạt
    <div
      className={cn(
        "flex h-14 items-center gap-2 border-b border-border bg-surface px-4 sm:h-12 sm:gap-3 sm:px-5",
        hasSelection && "sticky top-16 z-10 lg:top-20",
      )}
    >
      {/* Không có dòng thì ẩn ô chọn nhưng giữ chỗ, chữ không xê dịch */}
      <Checkbox
        size="sm"
        checked={getSelectAllState()}
        onCheckedChange={onToggleSelectAll}
        disabled={!hasComments}
        aria-label={
          hasSelection ? "Bỏ chọn tất cả" : "Chọn tất cả bình luận trong trang"
        }
        className={cn(
          CHECKBOX_HIT_AREA_CLASS_NAME,
          !hasComments && "invisible",
        )}
      />
      {!hasSelection && (
        <span className="text-xs font-medium text-muted">Bình luận</span>
      )}
      {hasSelection && (
        <>
          <span className="whitespace-nowrap text-sm font-medium tabular-nums text-foreground">
            Đã chọn {selectedCount}
          </span>
          <Button
            variant="ghost"
            onClick={onClearSelection}
            // Dưới sm không đủ chỗ: bấm ô chọn tất cả (đang chọn dở) cũng là bỏ chọn
            className="-ml-1 hidden h-8 whitespace-nowrap rounded-lg px-2 text-sm font-normal text-muted hover:bg-foreground/5 hover:text-foreground sm:inline-flex"
          >
            Bỏ chọn
          </Button>
          <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
            {canReject && (
              <Button
                variant="ghost"
                disabled={Boolean(pendingChange)}
                isLoading={
                  isBulkChanging &&
                  pendingChange?.status === CommentStatus.Rejected
                }
                onClick={() =>
                  onChangeStatus(selectedComments, CommentStatus.Rejected)
                }
                className={cn(
                  bulkButtonClassName,
                  "text-foreground/70 hover:bg-foreground/[0.08] hover:text-foreground",
                )}
              >
                <span className={bulkContentClassName}>
                  <X className="hidden size-4 sm:block" />
                  Từ chối
                  <span className="hidden tabular-nums sm:inline">
                    {selectedCount}
                  </span>
                </span>
              </Button>
            )}
            {canApprove && (
              <Button
                variant="primary"
                disabled={Boolean(pendingChange)}
                isLoading={
                  isBulkChanging &&
                  pendingChange?.status === CommentStatus.Approved
                }
                onClick={() =>
                  onChangeStatus(selectedComments, CommentStatus.Approved)
                }
                className={bulkButtonClassName}
              >
                <span className={bulkContentClassName}>
                  <Check className="hidden size-4 sm:block" />
                  Duyệt
                  <span className="hidden tabular-nums sm:inline">
                    {selectedCount}
                  </span>
                </span>
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
