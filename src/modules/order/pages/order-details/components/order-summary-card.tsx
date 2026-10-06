import { CourseCover } from "@/shared/components/course";
import Link from "next/link";
import {
  ORDER_SUPPORT_NAME,
  ORDER_SUPPORT_URL,
} from "../../../constants/order-details.constants";
import { OrderDetailsData } from "../../../types";
import { formatOrderPrice } from "../../../utils";

interface OrderSummaryCardProps {
  order: OrderDetailsData;
  /** Khối bên trái đã có nút liên hệ thì bỏ dòng hỗ trợ ở đây */
  hasSupportLink: boolean;
}

/** Khóa đang mua và cách ra số tiền: giá gốc, mã giảm, tổng */
export function OrderSummaryCard({
  order,
  hasSupportLink,
}: OrderSummaryCardProps) {
  const hasDiscount = order.discount > 0;

  return (
    <section
      aria-labelledby="order-summary-title"
      className="rounded-2xl border border-border bg-surface"
    >
      <div className="p-4 sm:p-5">
        <h2
          id="order-summary-title"
          className="text-base font-semibold text-foreground"
        >
          Tóm tắt đơn hàng
        </h2>
        <div className="mt-4 flex items-start gap-3">
          <CourseCover
            image={order.course?.image}
            sizes="96px"
            className="aspect-video w-24 shrink-0 rounded-lg"
          />
          {order.course && (
            <Link
              href={`/course/${order.course.slug}`}
              className="line-clamp-3 text-pretty text-sm font-medium text-foreground hover:underline"
            >
              {order.course.title}
            </Link>
          )}
          {!order.course && (
            <p className="text-sm text-muted">Khóa học đã gỡ khỏi hệ thống</p>
          )}
        </div>
        <dl className="mt-5 space-y-2 text-sm">
          <div className="flex items-baseline justify-between gap-4">
            <dt className="text-muted">Giá khóa học</dt>
            <dd className="whitespace-nowrap tabular-nums text-foreground">
              {formatOrderPrice(order.amount)}
            </dd>
          </div>
          {hasDiscount && (
            <div className="flex items-baseline justify-between gap-4">
              <dt className="min-w-0 text-muted">
                Giảm giá
                {order.couponCode && (
                  <span className="font-mono"> · {order.couponCode}</span>
                )}
              </dt>
              <dd className="whitespace-nowrap tabular-nums text-foreground">
                −{formatOrderPrice(order.discount)}
              </dd>
            </div>
          )}
          <div className="flex items-baseline justify-between gap-4 border-t border-border pt-3">
            <dt className="font-medium text-foreground">Tổng thanh toán</dt>
            <dd className="whitespace-nowrap text-base font-semibold tabular-nums text-foreground">
              {formatOrderPrice(order.total)}
            </dd>
          </div>
        </dl>
      </div>
      {hasSupportLink && (
        <p className="border-t border-border px-4 py-3 text-sm text-muted sm:px-5">
          Cần hỗ trợ?{" "}
          <a
            href={ORDER_SUPPORT_URL}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary-strong"
          >
            Nhắn {ORDER_SUPPORT_NAME}
          </a>
        </p>
      )}
    </section>
  );
}
