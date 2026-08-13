import { bankAccountInfo } from "@/shared/constants/payment.constants";
import { OrderApprovedEmailData, OrderReminderEmailData } from "../types";

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount);
}

export function buildOrderApprovedEmail(data: OrderApprovedEmailData) {
  const productName = data.courseTitle || `gói ${data.plan}`;

  return {
    subject: `Đơn hàng ${data.code} đã được thanh toán thành công 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #171725;">
        <p>Chào ${data.username},</p>
        <p>
          EvonHub đã nhận được thanh toán cho đơn hàng
          <strong>${data.code}</strong> — <strong>${productName}</strong>.
        </p>
        <p>Số tiền: <strong>${formatMoney(data.total)} VNĐ</strong></p>
        <p>
          Bạn có thể vào
          <a href="https://evonhub.dev/study">khu vực học tập</a>
          để bắt đầu học ngay bây giờ.
        </p>
        <p>Cảm ơn bạn đã tin tưởng EvonHub!</p>
      </div>
    `,
  };
}

export function buildOrderReminderEmail(data: OrderReminderEmailData) {
  return {
    subject: `Đơn hàng ${data.code} của bạn chưa được thanh toán`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #171725;">
        <p>Chào ${data.username},</p>
        <p>
          Đơn hàng <strong>${data.code}</strong>
          ${data.courseTitle ? `cho khóa <strong>${data.courseTitle}</strong>` : ""}
          vẫn đang chờ thanh toán. Đơn còn hiệu lực
          <strong>${data.remainingTime}</strong> nữa.
        </p>
        <p>Bạn quét mã QR bên dưới, hoặc chuyển khoản theo thông tin sau:</p>
        <ul>
          <li>Ngân hàng: <strong>${bankAccountInfo.bankName}</strong></li>
          <li>Số tài khoản: <strong>${bankAccountInfo.accountNumber}</strong></li>
          <li>Chủ tài khoản: <strong>${bankAccountInfo.accountName}</strong></li>
          <li>Số tiền: <strong>${formatMoney(data.total)} VNĐ</strong></li>
          <li>Nội dung: <strong>${data.code}</strong></li>
        </ul>
        <p><img src="${data.qrUrl}" alt="QR thanh toán" width="240" height="240" /></p>
        <p>
          Hệ thống tự động xác nhận trong vài phút sau khi nhận được tiền.
          Xem chi tiết đơn tại
          <a href="https://evonhub.dev/order/${data.code}">evonhub.dev/order/${data.code}</a>.
        </p>
      </div>
    `,
  };
}
