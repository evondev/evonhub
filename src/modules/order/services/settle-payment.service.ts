import CourseModel from "@/modules/course/models";
import { sendOrderApprovedEmail } from "@/modules/email/services/order-email.service";
import UserModel from "@/modules/user/models";
import { OrderStatus } from "@/shared/constants/order.constants";
import { bankAccountInfo } from "@/shared/constants/payment.constants";
import OrderModel from "../models";
import { SepayWebhookPayload, SettlePaymentResult } from "../types";
import { extractOrderCode } from "../utils";
import { grantOrderToUser } from "./grant-order.service";

async function notifyOrderApproved(orderId: string): Promise<void> {
  const order = await OrderModel.findById(orderId);

  if (!order) return;

  const findUser = await UserModel.findById(order.user).select(
    "email username"
  );

  if (!findUser?.email) return;

  const findCourse = order.course
    ? await CourseModel.findById(order.course).select("title")
    : null;

  await sendOrderApprovedEmail(findUser.email, {
    code: order.code,
    username: findUser.username || "bạn",
    total: order.total,
    courseTitle: findCourse?.title,
    plan: order.plan,
  });
}

/**
 * Đối soát một giao dịch SePay với đơn hàng.
 *
 * - Trùng giao dịch (webhook gọi lại): bỏ qua, không cộng tiền hai lần.
 * - Đủ hoặc dư tiền: duyệt đơn, cấp quyền, gửi email xác nhận.
 * - Thiếu tiền: giữ PENDING và ghi log để admin xử lý tay.
 */
export async function settleSepayPayment(
  payload: SepayWebhookPayload
): Promise<SettlePaymentResult> {
  if (payload.transferType !== "in") {
    return { handled: false, message: "Bỏ qua giao dịch tiền ra" };
  }

  if (
    payload.accountNumber &&
    payload.accountNumber !== bankAccountInfo.accountNumber
  ) {
    return { handled: false, message: "Giao dịch của tài khoản khác" };
  }

  const orderCode = extractOrderCode(
    payload.code,
    payload.content,
    payload.description
  );

  if (!orderCode) {
    return { handled: false, message: "Không tìm thấy mã đơn hàng" };
  }

  const reference = String(payload.id);

  // Cộng tiền và ghi nhận giao dịch trong một thao tác atomic. Webhook gọi lại
  // cùng một id sẽ không khớp filter nên không bị cộng trùng.
  const paidOrder = await OrderModel.findOneAndUpdate(
    {
      code: orderCode,
      status: OrderStatus.Pending,
      paymentReferences: { $ne: reference },
    },
    {
      $inc: { paidAmount: payload.transferAmount },
      $set: { paidAt: new Date() },
      $addToSet: { paymentReferences: reference },
    },
    { new: true }
  );

  if (!paidOrder) {
    return {
      handled: false,
      message: "Đơn không tồn tại, đã xử lý hoặc giao dịch đã ghi nhận",
    };
  }

  if (paidOrder.paidAmount < paidOrder.total) {
    paidOrder.paymentNote = `Khách chuyển thiếu: đã nhận ${paidOrder.paidAmount}/${paidOrder.total}`;
    await paidOrder.save();

    console.log(
      `[sepay] Đơn ${paidOrder.code} thiếu tiền: ${paidOrder.paidAmount}/${paidOrder.total}`
    );

    return { handled: true, message: "Thiếu tiền, chờ xử lý tay" };
  }

  const isOverpaid = paidOrder.paidAmount > paidOrder.total;

  paidOrder.status = OrderStatus.Approved;
  paidOrder.paymentNote = isOverpaid
    ? `Khách chuyển dư: đã nhận ${paidOrder.paidAmount}/${paidOrder.total}`
    : "Tự động duyệt qua SePay";
  await paidOrder.save();

  if (isOverpaid) {
    console.log(
      `[sepay] Đơn ${paidOrder.code} dư tiền: ${paidOrder.paidAmount}/${paidOrder.total}, vẫn duyệt`
    );
  }

  await grantOrderToUser(paidOrder);
  await notifyOrderApproved(paidOrder._id);

  return { handled: true, message: "Đã duyệt đơn hàng", isApproved: true };
}
