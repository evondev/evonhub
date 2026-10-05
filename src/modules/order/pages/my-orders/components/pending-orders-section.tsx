import { MyOrderItem } from "../../../types";
import { PendingOrderRow } from "./pending-order-row";

interface PendingOrdersSectionProps {
  orders: MyOrderItem[];
  now: Date;
}

export function PendingOrdersSection({
  orders,
  now,
}: PendingOrdersSectionProps) {
  return (
    <section
      aria-labelledby="pending-orders-title"
      className="rounded-2xl border border-border bg-surface"
    >
      <div className="px-4 pt-4 sm:px-5 sm:pt-5">
        <h2
          id="pending-orders-title"
          className="text-base font-semibold text-foreground"
        >
          Chờ thanh toán
        </h2>
        <p className="mt-1 max-w-[62ch] text-pretty text-sm text-muted">
          Đơn tự duyệt ngay khi tiền về. Quá 24 giờ chưa thanh toán thì đơn hết
          hạn.
        </p>
      </div>
      <ul className="divide-y divide-border">
        {orders.map((order) => (
          <PendingOrderRow key={order.id} order={order} now={now} />
        ))}
      </ul>
    </section>
  );
}
