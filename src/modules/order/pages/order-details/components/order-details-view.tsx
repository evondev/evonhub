import { OrderDetailsData } from "../../../types";
import {
  getOrderDetailsKind,
  isOrderAwaitingApproval,
  isOrderPartiallyPaid,
} from "../../../utils/order-details.utils";
import { OrderDetailsHeader } from "./order-details-header";
import { OrderMainPanel } from "./order-main-panel";
import { OrderPartialPaymentBanner } from "./order-partial-payment-banner";
import { OrderPaymentWatcher } from "./order-payment-watcher";
import { OrderSummaryCard } from "./order-summary-card";

interface OrderDetailsViewProps {
  order: OrderDetailsData;
  referenceTime: number;
  isJustPaid?: boolean;
  /** Trang xem trước: không hỏi trạng thái, không tự chuyển trang */
  isPreview?: boolean;
}

/**
 * Trang chi tiết đơn: việc cần làm tiếp bên trái, tóm tắt đơn bên phải. Cột
 * hẹp như trang form, bám trái: rộng hơn thì nút sao chép xa giá trị của nó.
 */
export function OrderDetailsView({
  order,
  referenceTime,
  isJustPaid,
  isPreview,
}: OrderDetailsViewProps) {
  const now = new Date(referenceTime);
  const kind = getOrderDetailsKind(order, now);
  const isPartiallyPaid = kind === "sepay-pending" && isOrderPartiallyPaid(order);
  const hasSupportInPanel =
    kind === "rejected" || kind === "manual-missing-payee";

  return (
    <div className="flex max-w-[68rem] flex-col gap-4 sm:gap-6">
      {!isPreview && isOrderAwaitingApproval(kind) && (
        <OrderPaymentWatcher code={order.code} />
      )}
      <OrderDetailsHeader order={order} kind={kind} />
      {isPartiallyPaid && <OrderPartialPaymentBanner order={order} />}
      <div className="grid items-start gap-4 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <OrderMainPanel
          order={order}
          kind={kind}
          now={now}
          isJustPaid={isJustPaid}
          isPreview={isPreview}
        />
        <OrderSummaryCard order={order} hasSupportLink={!hasSupportInPanel} />
      </div>
    </div>
  );
}
