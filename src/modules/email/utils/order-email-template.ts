import { bankAccountInfo } from "@/shared/constants/payment.constants";
import {
  OrderApprovedEmailData,
  OrderCreatedEmailData,
  OrderReminderEmailData,
} from "../types";
import { EMAIL_BRAND, renderEmailLayout, renderInfoRows } from "./email-layout";

function formatMoney(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount);
}

function renderPaymentBlock(code: string, total: number, qrUrl: string): string {
  return `
    ${renderInfoRows([
      { label: "Ngân hàng", value: bankAccountInfo.bankCode },
      { label: "Số tài khoản", value: bankAccountInfo.accountNumber },
      { label: "Chủ tài khoản", value: bankAccountInfo.accountName },
      { label: "Số tiền", value: `${formatMoney(total)} VNĐ` },
      { label: "Nội dung", value: code },
    ])}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding-bottom: 6px;">
          <img src="${qrUrl}" width="220" height="220" alt="Mã QR thanh toán đơn ${code}" style="border: 1px solid ${EMAIL_BRAND.border}; border-radius: 12px;" />
        </td>
      </tr>
      <tr>
        <td align="center" style="color: ${EMAIL_BRAND.muted}; font-size: 13px; padding-bottom: 16px;">
          Quét mã bằng app ngân hàng, số tiền và nội dung đã điền sẵn
        </td>
      </tr>
    </table>`;
}

export function buildOrderCreatedEmail(data: OrderCreatedEmailData) {
  const productName = data.courseTitle || "khóa học";

  return {
    subject: `Còn một bước nữa thôi — đơn ${data.code}`,
    html: renderEmailLayout({
      preview: `Chuyển khoản ${formatMoney(data.total)} VNĐ với nội dung ${data.code} là xong.`,
      heading: `Chào ${data.username}, chỉ còn một bước nữa thôi!`,
      body: `
        <p style="margin: 0 0 14px;">
          Bạn vừa đặt <strong>${productName}</strong>. Chuyển khoản xong là khóa học
          mở ngay, thường trong vòng một phút — không cần chờ ai duyệt tay.
        </p>
        <p style="margin: 0 0 14px;">
          Nhớ giữ nguyên nội dung chuyển khoản <strong>${data.code}</strong>, đó là
          thứ giúp hệ thống nhận ra đơn của bạn.
        </p>
        ${renderPaymentBlock(data.code, data.total, data.qrUrl)}
        <p style="margin: 0 0 14px; color: ${EMAIL_BRAND.muted}; font-size: 14px;">
          Đơn giữ chỗ trong <strong>24 giờ</strong>. Quá hạn thì bạn vẫn đặt lại được
          bất cứ lúc nào, chỉ là phải tạo đơn mới.
        </p>`,
      button: {
        label: "Mở trang thanh toán",
        url: `${EMAIL_BRAND.siteUrl}/order/${data.code}`,
      },
      footerNote: `Xem lại mọi đơn của bạn tại <a href="${EMAIL_BRAND.siteUrl}/my-orders" style="color: ${EMAIL_BRAND.muted};">Đơn hàng của tôi</a>.`,
    }),
  };
}

export function buildOrderReminderEmail(data: OrderReminderEmailData) {
  const productName = data.courseTitle || "khóa học";

  return {
    subject: `Đơn ${data.code} vẫn đang chờ bạn`,
    html: renderEmailLayout({
      preview: `Còn ${data.remainingTime} để hoàn tất đơn ${data.code}.`,
      heading: "Đơn của bạn vẫn còn đó",
      body: `
        <p style="margin: 0 0 14px;">
          Chào ${data.username}, hệ thống chưa nhận được thanh toán cho
          <strong>${productName}</strong>. Có thể bạn đang bận, hoặc đơn giản là
          quên mất — chuyện thường thôi.
        </p>
        <p style="margin: 0 0 14px;">
          Đơn còn hiệu lực <strong>${data.remainingTime}</strong> nữa. Quét mã dưới
          đây là xong trong một phút:
        </p>
        ${renderPaymentBlock(data.code, data.total, data.qrUrl)}
        <p style="margin: 0 0 14px; color: ${EMAIL_BRAND.muted}; font-size: 14px;">
          Nếu bạn đổi ý thì cứ bỏ qua email này, chúng tôi sẽ không nhắc thêm lần nào nữa.
        </p>`,
      button: {
        label: "Thanh toán ngay",
        url: `${EMAIL_BRAND.siteUrl}/order/${data.code}`,
      },
      footerNote: `Xem lại mọi đơn của bạn tại <a href="${EMAIL_BRAND.siteUrl}/my-orders" style="color: ${EMAIL_BRAND.muted};">Đơn hàng của tôi</a>.`,
    }),
  };
}

export function buildOrderApprovedEmail(data: OrderApprovedEmailData) {
  const productName = data.courseTitle || `gói ${data.plan}`;

  return {
    subject: `Xong rồi! ${productName} đã mở cho bạn 🎉`,
    html: renderEmailLayout({
      preview: `Đã nhận ${formatMoney(data.total)} VNĐ cho đơn ${data.code}. Vào học thôi!`,
      heading: "Thanh toán thành công, vào học thôi!",
      body: `
        <p style="margin: 0 0 14px;">
          Chào ${data.username}, EvonHub đã nhận được
          <strong>${formatMoney(data.total)} VNĐ</strong> cho đơn
          <strong>${data.code}</strong>. <strong>${productName}</strong> đã mở khóa
          trong tài khoản của bạn.
        </p>
        <p style="margin: 0 0 14px;">
          Một lời khuyên nhỏ: đừng cố học hết trong một buổi. Mỗi ngày một bài, làm
          bài tập tới nơi tới chốn, ba tuần nữa nhìn lại bạn sẽ thấy khác hẳn.
        </p>
        <p style="margin: 0 0 14px;">
          Học tới đâu vướng chỗ nào cứ nhắn, mình hỗ trợ tới khi bạn làm được.
        </p>`,
      button: {
        label: "Bắt đầu học ngay",
        url: `${EMAIL_BRAND.siteUrl}/study`,
      },
      footerNote: `Hóa đơn của bạn được lưu tại <a href="${EMAIL_BRAND.siteUrl}/my-orders" style="color: ${EMAIL_BRAND.muted};">Đơn hàng của tôi</a>.`,
    }),
  };
}
