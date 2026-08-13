import { MAXIUM_DISCOUNT } from "@/shared/constants/common.constants";
import { CouponType } from "@/shared/constants/coupon.constants";
import { CouponItemData } from "../types";

/**
 * Tính số tiền được giảm từ coupon đã được xác thực.
 * Luôn chạy ở server để không phụ thuộc vào số tiền client gửi lên.
 */
export function calculateCouponDiscount(
  coupon: CouponItemData | undefined,
  price: number,
): number {
  if (!coupon?.amount) return 0;

  const discount =
    coupon.type === CouponType.Percentage
      ? (price * coupon.amount) / 100
      : coupon.amount;

  return Math.min(Math.max(discount, 0), MAXIUM_DISCOUNT, price);
}
