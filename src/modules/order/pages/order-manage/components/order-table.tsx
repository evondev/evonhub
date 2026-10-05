import { cn } from "@/shared/utils";
import {
  canProcessOrder,
  getOrderManageStatusView,
} from "../../../utils/order-manage.utils";
import { OrderManageRow } from "../../../types/order-manage.types";
import { OrderAmount } from "./order-amount";
import { OrderCode } from "./order-code";
import { OrderCourseLabel } from "./order-course-label";
import { OrderRowActions } from "./order-row-actions";
import { OrderStatusCell } from "./order-status-cell";
import { OrderStudent } from "./order-student";
import { OrderTableHead } from "./order-table-head";

interface OrderTableProps {
  orders: OrderManageRow[];
  referenceTime: number;
  isActionDisabled: boolean;
  onApprove: (order: OrderManageRow) => void;
  onReject: (order: OrderManageRow) => void;
  className?: string;
}

const bodyCellClassName = "px-4 py-3.5 align-top";

/** Bảng đơn từ xl. Tên học viên, tên khoá dài thì cắt, rê vào xem đủ */
export function OrderTable({
  orders,
  referenceTime,
  isActionDisabled,
  onApprove,
  onReject,
  className,
}: OrderTableProps) {
  const now = new Date(referenceTime);

  return (
    <table className={cn("w-full table-fixed text-left", className)}>
      <OrderTableHead />
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b border-border last:border-0">
            <td className={cn(bodyCellClassName, "pl-5")}>
              <OrderCode order={order} referenceTime={referenceTime} />
            </td>
            <td className={bodyCellClassName}>
              <OrderStudent student={order.student} />
            </td>
            <td className={bodyCellClassName}>
              <OrderCourseLabel order={order} />
            </td>
            <td className={bodyCellClassName}>
              <OrderStatusCell
                statusView={getOrderManageStatusView(order, now)}
              />
            </td>
            <td className={bodyCellClassName}>
              <OrderAmount order={order} className="items-end" />
            </td>
            {/* py-3: nút 32px thẳng tâm dòng chữ đầu của các ô bên trái */}
            <td className="py-3 pl-2 pr-5 align-top">
              {canProcessOrder(order) && (
                <OrderRowActions
                  variant="table"
                  orderCode={order.code}
                  isDisabled={isActionDisabled}
                  onApprove={() => onApprove(order)}
                  onReject={() => onReject(order)}
                  className="justify-end"
                />
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
