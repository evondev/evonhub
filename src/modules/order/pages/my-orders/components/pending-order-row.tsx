import { Button } from "@/components/ui/button";
import { CourseCover } from "@/shared/components/course";
import { cn } from "@/shared/utils";
import { Clock } from "lucide-react";
import Link from "next/link";
import { MyOrderItem } from "../../../types";
import {
  formatOrderDate,
  formatRemainingPendingTime,
  isPendingOrderUrgent,
} from "../../../utils";
import { OrderPrice } from "./order-price";

interface PendingOrderRowProps {
  order: MyOrderItem;
  now: Date;
}

export function PendingOrderRow({ order, now }: PendingOrderRowProps) {
  const createdAt = new Date(order.createdAt);
  const isUrgent = isPendingOrderUrgent(createdAt, now);

  return (
    <li className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:gap-6 sm:px-5">
      <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center sm:gap-4">
        <CourseCover
          image={order.course?.image}
          sizes="112px"
          className="aspect-video w-24 shrink-0 rounded-lg sm:w-28"
        />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-pretty text-sm font-semibold text-foreground">
            {order.course?.title || `Đơn hàng ${order.code}`}
          </h3>
          <p className="mt-1 text-xs text-muted">
            <span className="font-mono">{order.code}</span> · Đặt ngày{" "}
            {formatOrderDate(createdAt, now)}
          </p>
          <p
            className={cn(
              "mt-1 flex items-center gap-1 text-xs",
              isUrgent && "font-medium text-amber-700 dark:text-orange-400",
              !isUrgent && "text-muted",
            )}
          >
            <Clock aria-hidden className="size-3.5 shrink-0" />
            Còn {formatRemainingPendingTime(createdAt, now)} để thanh toán
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 sm:justify-end sm:gap-6">
        <OrderPrice order={order} size="base" className="sm:text-right" />
        <Button asChild variant="primary" className="shrink-0">
          <Link href={`/order/${order.code}`}>Thanh toán</Link>
        </Button>
      </div>
    </li>
  );
}
