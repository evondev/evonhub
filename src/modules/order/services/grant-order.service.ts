import UserModel from "@/modules/user/models";
import { MembershipPlan } from "@/shared/constants/user.constants";
import { OrderModelProps } from "../types";

export function isMembershipOrder(order: OrderModelProps): boolean {
  return !!order.plan && order.plan !== MembershipPlan.None;
}

/**
 * Cấp quyền cho user sau khi đơn hàng được duyệt.
 * Dùng chung cho admin duyệt tay và webhook SePay duyệt tự động.
 */
export async function grantOrderToUser(order: OrderModelProps): Promise<void> {
  // Tính năng membership đã ngưng, không cấp gói mới nữa
  if (isMembershipOrder(order)) {
    console.log(
      `[order] Bỏ qua đơn membership ${order.code}, tính năng đã ngưng`
    );

    return;
  }

  if (!order.course) return;

  await UserModel.updateOne(
    { _id: order.user },
    { $addToSet: { courses: order.course } }
  );
}

/** Gỡ quyền đã cấp khi đơn hàng bị hủy. */
export async function revokeOrderFromUser(
  order: OrderModelProps
): Promise<void> {
  // Đơn gói hội viên cũ không cấp quyền gì nên cũng không có gì để gỡ
  if (isMembershipOrder(order) || !order.course) return;

  await UserModel.updateOne(
    { _id: order.user },
    { $pull: { courses: order.course } }
  );
}
