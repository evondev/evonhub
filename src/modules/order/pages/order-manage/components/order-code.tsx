import { cn } from "@/shared/utils";
import Link from "next/link";
import { OrderManageRow } from "../../../types/order-manage.types";
import { OrderCreatedTime } from "./order-created-time";

interface OrderCodeProps {
  order: OrderManageRow;
  referenceTime: number;
  className?: string;
}

/** Mã đơn (mở trang đơn hàng) trên giờ tạo */
export function OrderCode({ order, referenceTime, className }: OrderCodeProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Link
        href={`/order/${order.code}`}
        className="whitespace-nowrap text-sm font-medium tabular-nums text-foreground underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground"
      >
        {order.code}
      </Link>
      <OrderCreatedTime
        createdAt={order.createdAt}
        referenceTime={referenceTime}
      />
    </div>
  );
}
