import { EmailText, TruncateTooltip } from "@/shared/components/common";
import Link from "next/link";
import {
  canProcessOrder,
  getOrderManageStatusView,
} from "../../../utils/order-manage.utils";
import { OrderManageRow } from "../../../types/order-manage.types";
import { OrderAmount } from "./order-amount";
import { OrderCourseLabel } from "./order-course-label";
import { OrderCreatedTime } from "./order-created-time";
import { OrderRowActions } from "./order-row-actions";
import { OrderStatusCell } from "./order-status-cell";

interface OrderListItemProps {
  order: OrderManageRow;
  referenceTime: number;
  isActionDisabled: boolean;
  onApprove: () => void;
  onReject: () => void;
}

/**
 * Một đơn khi khung hẹp hơn bảng: mã và giờ tạo bên trái, số tiền bên phải;
 * dưới là khoá, học viên, trạng thái; đơn còn chờ thì nút ở cuối
 */
export function OrderListItem({
  order,
  referenceTime,
  isActionDisabled,
  onApprove,
  onReject,
}: OrderListItemProps) {
  const studentLabel = [order.student.name, order.student.email]
    .filter(Boolean)
    .join(" · ");

  return (
    <li className="flex flex-col gap-1 border-b border-border px-4 py-4 last:border-0 sm:px-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
          <Link
            href={`/order/${order.code}`}
            className="-my-0.5 py-0.5 text-sm font-medium tabular-nums text-foreground underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground"
          >
            {order.code}
          </Link>
          <OrderCreatedTime
            createdAt={order.createdAt}
            referenceTime={referenceTime}
          />
        </div>
        <OrderAmount
          order={order}
          isDiscountShown={false}
          className="shrink-0 items-end"
        />
      </div>
      <OrderCourseLabel order={order} isMultiline />
      <TruncateTooltip
        content={
          <>
            {order.student.name && `${order.student.name} · `}
            <EmailText email={order.student.email} />
          </>
        }
      >
        <Link
          href={`/admin/user/update?email=${encodeURIComponent(order.student.email)}`}
          className="-my-1 truncate py-1 text-xs text-muted underline decoration-foreground/20 underline-offset-4 hover:text-foreground hover:decoration-foreground"
        >
          {studentLabel}
        </Link>
      </TruncateTooltip>
      <OrderStatusCell
        statusView={getOrderManageStatusView(order, new Date(referenceTime))}
        className="mt-2 flex-row items-center gap-2"
      />
      {canProcessOrder(order) && (
        <OrderRowActions
          variant="list"
          orderCode={order.code}
          isDisabled={isActionDisabled}
          onApprove={onApprove}
          onReject={onReject}
          className="mt-3"
        />
      )}
    </li>
  );
}
