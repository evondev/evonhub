import { ToneBadge } from "@/shared/components/common";
import { cn } from "@/shared/utils";
import { OrderManageStatusView } from "../../../types/order-manage.types";

interface OrderStatusCellProps {
  statusView: OrderManageStatusView;
  className?: string;
}

/** Badge trạng thái, dưới là một dòng nhỏ: đã nhận bao nhiêu, còn bao lâu, ai duyệt */
export function OrderStatusCell({
  statusView,
  className,
}: OrderStatusCellProps) {
  return (
    <div className={cn("flex flex-col items-start gap-1", className)}>
      <ToneBadge
        tone={statusView.tone}
        label={statusView.label}
        className="py-0.5"
      />
      {statusView.detail && (
        <span className="whitespace-nowrap text-xs tabular-nums text-muted">
          {statusView.detail}
        </span>
      )}
    </div>
  );
}
