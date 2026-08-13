import CourseModel from "@/modules/course/models";
import { sendOrderReminderEmail } from "@/modules/email/services/order-email.service";
import UserModel from "@/modules/user/models";
import {
  ORDER_REMINDER_DELAY_MS,
  OrderStatus,
} from "@/shared/constants/order.constants";
import OrderModel from "../models";
import { SendOrderRemindersResult } from "../types";
import {
  formatRemainingPendingTime,
  getPaymentQrUrl,
  getPendingOrderExpiryDate,
} from "../utils";

/**
 * Gửi email nhắc cho các đơn PENDING quá 1 giờ chưa nhận được tiền.
 * Mỗi đơn chỉ nhắc đúng một lần nhờ cờ `reminderSentAt`.
 */
export async function sendOrderReminders(): Promise<SendOrderRemindersResult> {
  const now = new Date();
  const remindBefore = new Date(now.getTime() - ORDER_REMINDER_DELAY_MS);

  const pendingOrders = await OrderModel.find({
    status: OrderStatus.Pending,
    reminderSentAt: null,
    paidAmount: { $lte: 0 },
    // Quá 1 giờ nhưng chưa hết hạn 24 giờ
    createdAt: {
      $lte: remindBefore,
      $gt: getPendingOrderExpiryDate(now),
    },
  });

  let sentCount = 0;

  for (const order of pendingOrders) {
    // Đặt cờ trước khi gửi để hai lần cron chạy chồng nhau không gửi trùng
    const lockedOrder = await OrderModel.findOneAndUpdate(
      { _id: order._id, reminderSentAt: null },
      { reminderSentAt: now },
      { new: true }
    );

    if (!lockedOrder) continue;

    const findUser = await UserModel.findById(order.user).select(
      "email username"
    );

    if (!findUser?.email) continue;

    const findCourse = order.course
      ? await CourseModel.findById(order.course).select("title")
      : null;

    const isSent = await sendOrderReminderEmail(findUser.email, {
      code: order.code,
      username: findUser.username || "bạn",
      total: order.total,
      remainingTime: formatRemainingPendingTime(order.createdAt, now),
      qrUrl: getPaymentQrUrl(order.code, order.total),
      courseTitle: findCourse?.title,
    });

    if (isSent) {
      sentCount += 1;
      continue;
    }

    // Gửi hỏng thì trả cờ về để lần chạy sau nhắc lại
    await OrderModel.updateOne(
      { _id: order._id },
      { $unset: { reminderSentAt: 1 } }
    );
  }

  return { candidates: pendingOrders.length, sent: sentCount };
}
