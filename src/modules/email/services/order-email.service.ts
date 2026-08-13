import { resendClient } from "@/shared/libs/resend";
import {
  OrderApprovedEmailData,
  OrderReminderEmailData,
  SendTransactionalEmailProps,
} from "../types";
import {
  buildOrderApprovedEmail,
  buildOrderReminderEmail,
} from "../utils/order-email-template";

/**
 * Email giao dịch gửi qua Resend với RESEND_FROM (hello@evonhub.dev).
 * EMAIL_FROM là domain riêng, không dùng ở đây.
 */
async function sendTransactionalEmail({
  to,
  subject,
  html,
}: SendTransactionalEmailProps): Promise<boolean> {
  const from = process.env.RESEND_FROM;

  if (!from) {
    console.log("Thiếu RESEND_FROM, bỏ qua gửi email:", subject);

    return false;
  }

  const { error } = await resendClient.emails.send({
    from,
    to: [to],
    subject,
    html,
    replyTo: process.env.REPLY_TO_EMAIL,
  });

  if (error) {
    console.log("Gửi email thất bại:", error);

    return false;
  }

  return true;
}

export async function sendOrderApprovedEmail(
  to: string,
  data: OrderApprovedEmailData
): Promise<boolean> {
  const { subject, html } = buildOrderApprovedEmail(data);

  return sendTransactionalEmail({ to, subject, html });
}

export async function sendOrderReminderEmail(
  to: string,
  data: OrderReminderEmailData
): Promise<boolean> {
  const { subject, html } = buildOrderReminderEmail(data);

  return sendTransactionalEmail({ to, subject, html });
}
