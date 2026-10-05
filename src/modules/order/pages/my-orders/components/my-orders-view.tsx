import { MyOrderItem } from "../../../types";
import { groupMyOrders } from "../../../utils";
import { MyOrdersEmpty } from "./my-orders-empty";
import { OrderHistorySection } from "./order-history-section";
import { PendingOrdersSection } from "./pending-orders-section";

interface MyOrdersViewProps {
  orders: MyOrderItem[];
  referenceTime: number;
}

/** Đơn còn phải thanh toán đứng đầu, phần còn lại là lịch sử */
export function MyOrdersView({ orders, referenceTime }: MyOrdersViewProps) {
  if (orders.length === 0) return <MyOrdersEmpty />;

  const now = new Date(referenceTime);
  const { pendingOrders, historyItems } = groupMyOrders(orders, now);

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {pendingOrders.length > 0 && (
        <PendingOrdersSection orders={pendingOrders} now={now} />
      )}
      {historyItems.length > 0 && (
        <OrderHistorySection
          historyItems={historyItems}
          referenceTime={referenceTime}
        />
      )}
    </div>
  );
}
