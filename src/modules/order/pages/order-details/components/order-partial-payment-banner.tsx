import { TriangleAlert } from "lucide-react";
import { OrderDetailsData } from "../../../types";
import { formatOrderPrice } from "../../../utils";
import { getOrderAmountDue } from "../../../utils/order-details.utils";

interface OrderPartialPaymentBannerProps {
  order: OrderDetailsData;
}

/**
 * Khách chuyển thiếu: đơn vẫn chờ, cộng dồn khi chuyển thêm. Không có nút ✕ vì
 * banner tự hết khi đủ tiền, ẩn đi thì khách không hiểu sao số tiền đổi.
 */
export function OrderPartialPaymentBanner({
  order,
}: OrderPartialPaymentBannerProps) {
  return (
    <div
      role="status"
      className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10"
    >
      <TriangleAlert
        aria-hidden
        className="mt-0.5 size-5 shrink-0 text-amber-700 dark:text-orange-400"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-amber-800 dark:text-orange-300">
          Đã nhận {formatOrderPrice(order.paidAmount)}, còn thiếu{" "}
          {formatOrderPrice(getOrderAmountDue(order))}
        </p>
        <p className="mt-0.5 text-pretty text-sm text-foreground/80">
          Chuyển nốt số còn thiếu với đúng nội dung {order.code}, đơn tự duyệt
          khi đủ tiền.
        </p>
      </div>
    </div>
  );
}
