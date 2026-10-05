import { Button } from "@/components/ui/button";
import { AppTooltip } from "@/shared/components/common";
import { cn } from "@/shared/utils";
import { Check, X } from "lucide-react";

interface OrderRowActionsProps {
  /** "table": từ chối chỉ có icon cho cột hẹp; "list": cả hai nút có chữ */
  variant: "table" | "list";
  orderCode: string;
  isDisabled: boolean;
  onApprove: () => void;
  onReject: () => void;
  className?: string;
}

const rejectLabel = "Từ chối đơn";

/** Duyệt là nút viền (việc chính), từ chối nhẹ hơn. Chỉ đơn còn chờ mới có */
export function OrderRowActions({
  variant,
  orderCode,
  isDisabled,
  onApprove,
  onReject,
  className,
}: OrderRowActionsProps) {
  const isTable = variant === "table";

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Button
        variant="outline"
        disabled={isDisabled}
        onClick={onApprove}
        aria-label={`Duyệt đơn ${orderCode}`}
        className={cn(
          "gap-1.5 rounded-lg px-3",
          isTable && "h-8",
          !isTable && "h-9",
        )}
      >
        <Check className="size-4" />
        Duyệt
      </Button>
      {isTable && (
        <AppTooltip content={rejectLabel}>
          <Button
            variant="ghost"
            size="icon"
            disabled={isDisabled}
            onClick={onReject}
            aria-label={`${rejectLabel} ${orderCode}`}
            className="size-8 rounded-lg text-muted hover:bg-foreground/[0.08] hover:text-foreground disabled:hover:bg-transparent"
          >
            <X className="size-4" />
          </Button>
        </AppTooltip>
      )}
      {!isTable && (
        <Button
          variant="ghost"
          disabled={isDisabled}
          onClick={onReject}
          aria-label={`${rejectLabel} ${orderCode}`}
          className="h-9 gap-1.5 rounded-lg px-3 text-foreground/70 hover:bg-foreground/[0.08] hover:text-foreground"
        >
          <X className="size-4" />
          Từ chối
        </Button>
      )}
    </div>
  );
}
