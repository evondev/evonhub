import { ToneBadge } from "@/shared/components/common";
import { CourseCover } from "@/shared/components/course";
import { cn } from "@/shared/utils";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { MY_ORDER_STATUS_META } from "../../../constants";
import { MyOrderHistoryItem } from "../../../types";
import {
  formatOrderDate,
  getMyOrderBadgeLabel,
  getMyOrderHistoryHref,
} from "../../../utils";
import { OrderPrice } from "./order-price";

interface OrderHistoryRowProps {
  historyItem: MyOrderHistoryItem;
  now: Date;
}

const rowClassName =
  "flex min-w-0 items-center gap-3 rounded-xl p-2 sm:gap-4 sm:px-3";

export function OrderHistoryRow({ historyItem, now }: OrderHistoryRowProps) {
  const { order, status } = historyItem;
  const href = getMyOrderHistoryHref(historyItem);
  const actionLabel = status === "paid" ? "Vào học" : "Mua lại";
  const badge = (
    <ToneBadge
      tone={MY_ORDER_STATUS_META[status].tone}
      label={getMyOrderBadgeLabel(historyItem)}
    />
  );
  const rowContent = (
    <>
      <CourseCover
        image={order.course?.image}
        sizes="80px"
        className="aspect-video w-20 shrink-0 rounded-lg"
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "line-clamp-2 text-pretty text-sm font-medium",
            order.course && "text-foreground",
            !order.course && "text-muted",
          )}
        >
          {order.course?.title || "Khóa học đã gỡ"}
        </p>
        <p className="mt-0.5 text-xs text-muted">
          <span className="font-mono">{order.code}</span> ·{" "}
          {formatOrderDate(order.createdAt, now)}
        </p>
        {/* Dưới sm: trạng thái và số tiền xuống một hàng riêng */}
        <div className="mt-1.5 flex items-center justify-between gap-3 sm:hidden">
          {badge}
          <OrderPrice order={order} size="sm" className="text-right" />
        </div>
      </div>
      <div className="hidden w-32 shrink-0 sm:flex">{badge}</div>
      <OrderPrice
        order={order}
        size="sm"
        className="hidden w-28 shrink-0 text-right sm:block"
      />
      <span
        aria-hidden={!href}
        className="hidden w-24 shrink-0 items-center justify-end gap-1 text-sm font-medium text-foreground md:flex"
      >
        {href && (
          <>
            {actionLabel}
            <ChevronRight className="size-4 shrink-0 text-muted" />
          </>
        )}
      </span>
      {/* Dòng không có link vẫn giữ chỗ mũi tên để cột giá thẳng hàng */}
      <ChevronRight
        aria-hidden
        className={cn(
          "size-4 shrink-0 text-muted md:hidden",
          !href && "invisible",
        )}
      />
    </>
  );

  if (!href)
    return (
      <li>
        <div className={rowClassName}>{rowContent}</div>
      </li>
    );

  return (
    <li>
      <Link
        href={href}
        className={cn(rowClassName, "transition-colors hover:bg-item-hover")}
      >
        {rowContent}
      </Link>
    </li>
  );
}
