import "server-only";

import CourseModel from "@/modules/course/models";
import { OrderStatus } from "@/shared/constants/order.constants";
import OrderModel from "../models";

interface CreateManualOrderInput {
  userId: string;
  courseId: string;
}

/**
 * Ghi lại đơn APPROVED khi admin / expert cấp khóa thủ công cho học viên.
 * Giá lấy từ DB; khóa được tặng nên giảm toàn bộ, tổng tiền là 0 để không
 * tính vào doanh thu.
 */
export async function createManualOrder({
  userId,
  courseId,
}: CreateManualOrderInput): Promise<void> {
  const findCourse = await CourseModel.findById(courseId).select("price");

  if (!findCourse) return;

  const amount = findCourse.price || 0;

  await OrderModel.create({
    user: userId,
    course: courseId,
    amount,
    discount: amount,
    total: 0,
    status: OrderStatus.Approved,
    code: `DH${new Date().getTime().toString().slice(-8)}`,
  });
}
