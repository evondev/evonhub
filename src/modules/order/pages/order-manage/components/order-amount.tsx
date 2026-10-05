import { cn } from "@/shared/utils";
import { formatOrderPrice } from "../../../utils";
import { OrderManageRow } from "../../../types/order-manage.types";
import { OrderDiscount } from "./order-discount";

interface OrderAmountProps {
  order: OrderManageRow;
  /** Danh sách dòng hẹp bỏ dòng giảm giá, kẻo cột phải cao hơn cột trái */
  isDiscountShown?: boolean;
  className?: string;
}

/** Số tiền phải trả; có giảm giá thì dòng dưới ghi số giảm */
export function OrderAmount({
  order,
  isDiscountShown = true,
  className,
}: OrderAmountProps) {
  const hasDiscount = isDiscountShown && order.discount > 0;

  return (
    <div className={cn("flex flex-col gap-1 tabular-nums", className)}>
      <span className="whitespace-nowrap text-sm font-medium text-foreground">
        {formatOrderPrice(order.total)}
      </span>
      {hasDiscount && (
        <OrderDiscount
          discount={order.discount}
          couponCode={order.couponCode}
        />
      )}
    </div>
  );
}
