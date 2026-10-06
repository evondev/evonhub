import { ManualPaymentPayee } from "@/shared/types/payment.types";
import { OrderDetailsData } from "../../../types";
import {
  buildManualTransferRows,
  formatPendingOrderDeadline,
} from "../../../utils/order-details.utils";
import { OrderWaitingNote } from "./order-waiting-note";
import { PayeeContactButtons } from "./payee-contact-buttons";
import { TransferDetailList } from "./transfer-detail-list";

interface OrderManualPaymentCardProps {
  order: OrderDetailsData;
  payee: ManualPaymentPayee;
  now: Date;
}

/**
 * Khóa của chuyên gia: khách chuyển thẳng cho chuyên gia rồi gửi biên lai,
 * chuyên gia duyệt tay. Không có QR SePay. Đơn giữ 24 giờ như đơn SePay.
 */
export function OrderManualPaymentCard({
  order,
  payee,
  now,
}: OrderManualPaymentCardProps) {
  const deadline = formatPendingOrderDeadline(order.createdAt, now);

  return (
    <section
      aria-labelledby="order-payment-title"
      className="rounded-2xl border border-border bg-surface"
    >
      <div className="p-4 sm:p-5">
        <h2
          id="order-payment-title"
          className="text-base font-semibold text-foreground"
        >
          Chuyển khoản cho chuyên gia
        </h2>
        <p className="mt-1 max-w-[60ch] text-pretty text-sm text-muted">
          Khóa này do {payee.name} bán, bạn chuyển thẳng vào tài khoản của
          chuyên gia và gửi biên lai {deadline}.
        </p>
        {/* Không có QR bên cạnh: bó cột để nút sao chép đứng gần giá trị */}
        <div className="mt-5 max-w-md">
          <TransferDetailList rows={buildManualTransferRows(order, payee)} />
        </div>
      </div>
      <div className="border-t border-border p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-foreground">
          Chuyển xong thì gửi biên lai cho chuyên gia
        </h3>
        <p className="mt-1 max-w-[60ch] text-pretty text-sm text-muted">
          Chụp màn hình giao dịch, gửi kèm mã {order.code}. Chuyên gia duyệt
          xong thì khóa mở và bạn nhận email báo.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <PayeeContactButtons payee={payee} orderCode={order.code} />
        </div>
      </div>
      <div className="border-t border-border px-4 py-3 sm:px-5">
        <OrderWaitingNote message="Đang chờ chuyên gia xác nhận. Trang tự cập nhật khi đơn được duyệt." />
      </div>
    </section>
  );
}
