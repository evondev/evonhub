import { OrderStatus } from "@/shared/constants/order.constants";
import OrderModel from "../models";
import { CreatePendingOrderInput, CreatePendingOrderResult } from "../types";
import { getPendingOrderExpiryDate } from "../utils";

/**
 * Hết hạn các đơn PENDING quá 24 giờ của cặp (user × khóa học).
 * Không xóa cứng để còn giữ dữ liệu lịch sử.
 */
export async function expireStalePendingOrders({
  userId,
  courseId,
}: {
  userId: string;
  courseId: string;
}): Promise<number> {
  const result = await OrderModel.updateMany(
    {
      user: userId,
      course: courseId,
      status: OrderStatus.Pending,
      createdAt: { $lte: getPendingOrderExpiryDate() },
    },
    { status: OrderStatus.Expired }
  );

  return result.modifiedCount ?? 0;
}

/**
 * Tạo đơn PENDING mới cho khóa học. Đơn PENDING cũ quá hạn được cho hết hạn
 * trước để khách không bị chặn mua vĩnh viễn.
 *
 * Trả về `existingOrder` nếu khách đang có đơn PENDING còn hiệu lực.
 */
export async function createPendingOrder({
  userId,
  courseId,
  amount,
  discount,
  total,
  couponCode,
  couponId,
}: CreatePendingOrderInput): Promise<CreatePendingOrderResult> {
  await expireStalePendingOrders({ userId, courseId });

  // Check và insert gộp trong một thao tác atomic: double click hoặc 2 tab
  // không tạo được 2 đơn PENDING cho cùng một khóa học.
  const orderResult = await OrderModel.findOneAndUpdate(
    {
      user: userId,
      course: courseId,
      status: OrderStatus.Pending,
    },
    {
      // user / course / status lấy từ filter khi insert, không set lại ở đây
      $setOnInsert: {
        amount,
        discount,
        total,
        code: `DH${new Date().getTime().toString().slice(-8)}`,
        couponCode,
        coupon: couponId,
      },
    },
    {
      upsert: true,
      new: true,
      includeResultMetadata: true,
    }
  );

  if (orderResult.lastErrorObject?.updatedExisting) {
    return { existingOrder: orderResult.value };
  }

  return { order: orderResult.value };
}
