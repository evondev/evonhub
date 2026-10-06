import { cn } from "@/shared/utils";
import { Clock } from "lucide-react";
import Image from "next/image";
import { OrderDetailsData } from "../../../types";
import {
  formatRemainingPendingTime,
  getPaymentQrUrl,
  isPendingOrderUrgent,
} from "../../../utils";
import {
  buildSepayTransferRows,
  formatPendingOrderDeadline,
  getOrderAmountDue,
} from "../../../utils/order-details.utils";
import { OrderWaitingNote } from "./order-waiting-note";
import { TransferDetailList } from "./transfer-detail-list";

interface OrderSepayPaymentCardProps {
  order: OrderDetailsData;
  now: Date;
}

/** Chuyển khoản vào tài khoản SePay: QR bên trái, thông tin để chép bên phải */
export function OrderSepayPaymentCard({
  order,
  now,
}: OrderSepayPaymentCardProps) {
  const isUrgent = isPendingOrderUrgent(order.createdAt, now);
  const remainingTime = formatRemainingPendingTime(
    new Date(order.createdAt),
    now,
  );
  const qrUrl = getPaymentQrUrl(order.code, getOrderAmountDue(order));

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
          Chuyển khoản để hoàn tất
        </h2>
        <p
          className={cn(
            "mt-1 flex items-start gap-1.5 text-pretty text-sm",
            isUrgent && "font-medium text-amber-700 dark:text-orange-400",
            !isUrgent && "text-muted",
          )}
        >
          <Clock aria-hidden className="mt-0.5 size-4 shrink-0" />
          Còn {remainingTime} để thanh toán,{" "}
          {formatPendingOrderDeadline(order.createdAt, now)}
        </p>
        <div className="mt-5 grid gap-6 sm:grid-cols-[13rem_minmax(0,1fr)] sm:items-start">
          <TransferDetailList rows={buildSepayTransferRows(order)} />
          <figure className="flex flex-col items-center gap-2 sm:order-first">
            {/* QR luôn nền trắng: app ngân hàng quét QR trên nền tối kém */}
            <div className="rounded-xl border border-border bg-white p-2">
              <Image
                alt={`QR chuyển khoản đơn hàng ${order.code}`}
                src={qrUrl}
                width={192}
                height={192}
                unoptimized
                className="size-48"
              />
            </div>
            <figcaption className="max-w-52 text-pretty text-center text-xs text-muted">
              Quét bằng app ngân hàng, số tiền và nội dung đã điền sẵn
            </figcaption>
          </figure>
        </div>
      </div>
      <div className="border-t border-border px-4 py-3 sm:px-5">
        <OrderWaitingNote message="Đang chờ tiền về. Trang tự chuyển sang khu học tập ngay khi nhận được, thường dưới một phút." />
      </div>
    </section>
  );
}
