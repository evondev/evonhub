import UserModel from "@/modules/user/models";
import {
  getClearedMembershipFields,
  getMembershipFields,
} from "@/modules/user/utils";
import { MembershipPlan } from "@/shared/constants/user.constants";
import { OrderModelProps } from "../types";

export function isMembershipOrder(order: OrderModelProps): boolean {
  return !!order.plan && order.plan !== MembershipPlan.None;
}

/**
 * Cấp quyền cho user sau khi đơn hàng được duyệt: gói membership hoặc khóa học.
 * Dùng chung cho admin duyệt tay và webhook SePay duyệt tự động.
 */
export async function grantOrderToUser(order: OrderModelProps): Promise<void> {
  if (isMembershipOrder(order)) {
    await UserModel.updateOne(
      { _id: order.user },
      getMembershipFields(order.plan)
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
  const findUser = await UserModel.findById(order.user);

  if (!findUser) return;

  if (isMembershipOrder(order)) {
    if (findUser.isMembership && findUser.plan === order.plan) {
      await UserModel.updateOne(
        { _id: findUser._id },
        getClearedMembershipFields()
      );
    }

    return;
  }

  if (!order.course) return;

  await UserModel.updateOne(
    { _id: findUser._id },
    { $pull: { courses: order.course } }
  );
}
