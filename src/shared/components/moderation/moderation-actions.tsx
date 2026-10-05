import { Button } from "@/components/ui/button";
import { ModerationAction } from "@/shared/types";
import { cn } from "@/shared/utils";
import { Check, X } from "lucide-react";

interface ModerationActionsProps {
  canApprove: boolean;
  canReject: boolean;
  /** Việc đang chạy trên chính mục này; nút đó hiện vòng quay */
  runningAction?: ModerationAction;
  /** Có thao tác nào đang chạy trên trang thì khoá mọi nút */
  isDisabled: boolean;
  onApprove: () => void;
  onReject: () => void;
  className?: string;
}

const actionButtonClassName = "h-9 rounded-lg px-3 sm:h-8";

// Icon và chữ gói một khối: lúc lưu nút giấu khối này (vẫn giữ chỗ) và hiện
// vòng quay đè lên, nên nút không hẹp lại, nút bên cạnh không xô
const actionContentClassName = "inline-flex items-center gap-1.5";

/**
 * Duyệt là nút viền (việc chính), từ chối là nút chữ nhẹ hơn. Từ sm hai nút
 * giữ chỗ cố định: mục nào thiếu nút thì để trống đúng chỗ đó, nút cùng loại
 * thẳng cột giữa các dòng. Dưới sm nút xếp từ trái nên bỏ hẳn nút thiếu
 */
export function ModerationActions({
  canApprove,
  canReject,
  runningAction,
  isDisabled,
  onApprove,
  onReject,
  className,
}: ModerationActionsProps) {
  return (
    <div className={cn("items-center gap-1.5", className)}>
      <Button
        variant="outline"
        disabled={!canApprove || isDisabled}
        isLoading={runningAction === "approve"}
        onClick={onApprove}
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
        disabled={!canReject || isDisabled}
        isLoading={runningAction === "reject"}
        onClick={onReject}
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
