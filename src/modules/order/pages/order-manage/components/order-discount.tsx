import { AppTooltip } from "@/shared/components/common";
import { formatOrderDiscount } from "../../../utils/order-manage.utils";

interface OrderDiscountProps {
  discount: number;
  couponCode?: string;
}

/** "Giảm 300.000 đ"; có mã thì rê vào thấy mã */
export function OrderDiscount({ discount, couponCode }: OrderDiscountProps) {
  const discountLabel = (
    <span className="whitespace-nowrap text-xs text-muted">
      {formatOrderDiscount(discount)}
    </span>
  );

  if (!couponCode) return discountLabel;

  return <AppTooltip content={`Mã ${couponCode}`}>{discountLabel}</AppTooltip>;
}
