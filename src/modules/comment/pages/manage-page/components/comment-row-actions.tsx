import { Button } from "@/components/ui/button";
import { CommentStatus } from "@/shared/constants/comment.constants";
import { cn } from "@/shared/utils";
import { Check, X } from "lucide-react";
import {
  CommentManageRow,
  CommentPendingChange,
} from "../../../types/comment-manage.types";

interface CommentRowActionsProps {
  comment: CommentManageRow;
  pendingChange: CommentPendingChange | null;
  onChangeStatus: (comments: CommentManageRow[], status: CommentStatus) => void;
  className?: string;
}

const actionButtonClassName = "h-9 rounded-lg px-3 sm:h-8";

// Icon và chữ gói một khối: lúc lưu nút giấu khối này (vẫn giữ chỗ) và hiện
// vòng quay đè lên, nên nút không hẹp lại, nút bên cạnh không xô
const actionContentClassName = "inline-flex items-center gap-1.5";

/**
 * Duyệt là nút viền (việc chính), từ chối là nút chữ nhẹ hơn. Dòng đã duyệt chỉ
 * còn "Từ chối", dòng đã từ chối chỉ còn "Duyệt"
 */
export function CommentRowActions({
  comment,
  pendingChange,
  onChangeStatus,
  className,
}: CommentRowActionsProps) {
  const isChanging = Boolean(pendingChange?.commentIds.includes(comment.id));
  const canApprove = comment.status !== CommentStatus.Approved;
  const canReject = comment.status !== CommentStatus.Rejected;

  return (
    <div className={cn("items-center gap-1.5", className)}>
      {/* Từ sm hai nút giữ chỗ cố định: dòng nào thiếu nút thì để trống đúng
          chỗ đó, nút cùng loại thẳng cột giữa các dòng. Dưới sm nút xếp từ trái
          nên bỏ hẳn nút thiếu */}
      <Button
        variant="outline"
        disabled={!canApprove || Boolean(pendingChange)}
        isLoading={
          isChanging && pendingChange?.status === CommentStatus.Approved
        }
        onClick={() => onChangeStatus([comment], CommentStatus.Approved)}
        aria-hidden={!canApprove || undefined}
        tabIndex={canApprove ? undefined : -1}
        className={cn(
          actionButtonClassName,
          !canApprove && "hidden sm:invisible sm:inline-flex",
        )}
      >
        <span className={actionContentClassName}>
          <Check className="size-4" />
          Duyệt
        </span>
      </Button>
      <Button
        variant="ghost"
        disabled={!canReject || Boolean(pendingChange)}
        isLoading={
          isChanging && pendingChange?.status === CommentStatus.Rejected
        }
        onClick={() => onChangeStatus([comment], CommentStatus.Rejected)}
        aria-hidden={!canReject || undefined}
        tabIndex={canReject ? undefined : -1}
        className={cn(
          actionButtonClassName,
          "text-foreground/70 hover:bg-foreground/[0.08] hover:text-foreground",
          !canReject && "hidden sm:invisible sm:inline-flex",
        )}
      >
        <span className={actionContentClassName}>
          <X className="size-4" />
          Từ chối
        </span>
      </Button>
    </div>
  );
}
