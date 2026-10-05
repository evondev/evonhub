import { cn } from "@/shared/utils";
import { formatOrderPrice } from "../../../utils";
import { MyOrderItem } from "../../../types";

interface OrderPriceProps {
  order: MyOrderItem;
  /** Cỡ số tiền: đơn chờ thanh toán to hơn một bậc */
  size: "sm" | "base";
  className?: string;
}

/** Số tiền phải trả, kèm giá gốc gạch ngang khi đơn có giảm giá */
export function OrderPrice({ order, size, className }: OrderPriceProps) {
  const hasDiscount = order.discount > 0 && order.total > 0;
  const discountTitle = order.couponCode
    ? `Giảm ${formatOrderPrice(order.discount)} với mã ${order.couponCode}`
    : undefined;

  return (
    <div className={className}>
      <p
        className={cn(
          "whitespace-nowrap font-semibold tabular-nums text-foreground",
          size === "sm" && "text-sm",
          size === "base" && "text-base",
        )}
      >
        {formatOrderPrice(order.total)}
      </p>
      {hasDiscount && (
        <p
          title={discountTitle}
          className="whitespace-nowrap text-xs tabular-nums text-muted"
        >
          <span className="sr-only">Giá gốc </span>
          <s>{formatOrderPrice(order.amount)}</s>
        </p>
      )}
    </div>
  );
}
