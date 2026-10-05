import { AppTooltip } from "@/shared/components/common";
import { cn, formatFullDateTime } from "@/shared/utils";
import { formatOrderManageTime } from "../../../utils/order-manage.utils";

interface OrderCreatedTimeProps {
  createdAt: Date | string;
  referenceTime: number;
  className?: string;
}

/** Giờ tạo đơn "14:32, 05/10"; rê vào thấy đủ năm */
export function OrderCreatedTime({
  createdAt,
  referenceTime,
  className,
}: OrderCreatedTimeProps) {
  return (
    <AppTooltip content={formatFullDateTime(createdAt)}>
      <time
        dateTime={new Date(createdAt).toISOString()}
        className={cn(
          "whitespace-nowrap text-xs tabular-nums text-muted",
          className,
        )}
      >
        {formatOrderManageTime(createdAt, new Date(referenceTime))}
      </time>
    </AppTooltip>
  );
}
