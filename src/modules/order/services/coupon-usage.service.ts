import CouponModel from "@/modules/coupon/models";
import { FilterQuery } from "mongoose";

interface CouponUsageOrder {
  code: string;
  coupon?: unknown;
  couponCode?: string;
}

function buildCouponFilter(
  order: CouponUsageOrder,
): FilterQuery<typeof CouponModel> | null {
  if (order.coupon) return { _id: order.coupon };

  if (order.couponCode) return { code: order.couponCode };

  return null;
}

/**
 * Cộng 1 lượt dùng mã giảm giá khi đơn chuyển sang đã duyệt.
 * Gọi đúng một lần ở chỗ đơn chuyển trạng thái PENDING → APPROVED.
 * limit 0 / không đặt = không giới hạn, khớp với điều kiện ở handleCheckCoupon.
 */
export async function incrementCouponUsage(
  order: CouponUsageOrder,
): Promise<void> {
  const couponFilter = buildCouponFilter(order);

  if (!couponFilter) return;

  const updatedCoupon = await CouponModel.findOneAndUpdate(
    {
      ...couponFilter,
      $or: [
        { limit: null },
        { limit: { $lte: 0 } },
        { $expr: { $lt: [{ $ifNull: ["$used", 0] }, "$limit"] } },
      ],
    },
    { $inc: { used: 1 } },
  );

  // Khách đã trả tiền nên vẫn duyệt đơn, chỉ ghi log để admin biết mã đã vượt lượt
  if (!updatedCoupon) {
    console.log(
      `[coupon] Không cộng được lượt dùng mã cho đơn ${order.code} (mã không tồn tại hoặc đã hết lượt)`,
    );
  }
}

/** Trả lại 1 lượt dùng khi đơn đã duyệt bị hủy duyệt. */
export async function decrementCouponUsage(
  order: CouponUsageOrder,
): Promise<void> {
  const couponFilter = buildCouponFilter(order);

  if (!couponFilter) return;

  await CouponModel.updateOne(
    { ...couponFilter, used: { $gt: 0 } },
    { $inc: { used: -1 } },
  );
}
