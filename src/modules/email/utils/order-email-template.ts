import { bankAccountInfo } from "@/shared/constants/payment.constants";
import { escapeHtml } from "@/shared/helpers/html.helper";
import { ManualPaymentPayee } from "@/shared/types/payment.types";
import {
  ManualOrderCreatedEmailData,
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

// Thông tin do chuyên gia tự nhập trong hồ sơ nên phải escape trước khi ghép HTML
function renderManualPaymentBlock(
  code: string,
  total: number,
  payee: ManualPaymentPayee,
): string {
  const rows = [
    { label: "Ngân hàng", value: escapeHtml(payee.bankName) },
    { label: "Số tài khoản", value: escapeHtml(payee.bankNumber) },
    { label: "Chủ tài khoản", value: escapeHtml(payee.bankAccount) },
    { label: "Số tiền", value: `${formatMoney(total)} VNĐ` },
    { label: "Nội dung", value: code },
  ];

  if (payee.bankBranch) {
    rows.splice(3, 0, {
      label: "Chi nhánh",
      value: escapeHtml(payee.bankBranch),
    });
  }

  return renderInfoRows(rows);
}

function renderPayeeContacts(payee: ManualPaymentPayee): string {
  const linkStyle = `color: ${EMAIL_BRAND.primary}; font-weight: 600;`;
  const contacts: string[] = [];

  if (payee.facebook) {
    contacts.push(
      `<a href="${escapeHtml(payee.facebook)}" style="${linkStyle}">Facebook</a>`,
    );
  }

  if (payee.email) {
    contacts.push(
      `<a href="mailto:${escapeHtml(payee.email)}" style="${linkStyle}">${escapeHtml(payee.email)}</a>`,
    );
  }

  return contacts.join(" · ");
}

export function buildManualOrderCreatedEmail(
  data: ManualOrderCreatedEmailData,
) {
  const productName = data.courseTitle || "khóa học";
  const payeeName = escapeHtml(data.payee.name);
  const payeeContacts = renderPayeeContacts(data.payee);

  return {
    subject: `Chuyển khoản cho chuyên gia để mở khóa — đơn ${data.code}`,
    html: renderEmailLayout({
      preview: `Chuyển ${formatMoney(data.total)} VNĐ cho ${payeeName} với nội dung ${data.code}, rồi báo chuyên gia duyệt đơn.`,
      heading: `Chào ${data.username}, còn hai bước nữa thôi!`,
      body: `
        <p style="margin: 0 0 14px;">
          Bạn vừa đặt <strong>${productName}</strong> của chuyên gia
          <strong>${payeeName}</strong>. Khóa này thanh toán thẳng cho chuyên gia,
          không qua EvonHub.
        </p>
        <p style="margin: 0 0 14px;">
          <strong>Bước 1.</strong> Chuyển khoản vào tài khoản dưới đây, giữ nguyên
          nội dung <strong>${data.code}</strong>:
        </p>
        ${renderManualPaymentBlock(data.code, data.total, data.payee)}
        <p style="margin: 0 0 14px;">
          <strong>Bước 2.</strong> Gửi ảnh biên lai kèm mã đơn
          <strong>${data.code}</strong> cho chuyên gia${payeeContacts ? ` qua ${payeeContacts}` : ""}.
          Chuyên gia kiểm tra tài khoản rồi duyệt đơn, khóa học sẽ mở trong tài
          khoản của bạn và bạn nhận được email báo.
        </p>
        <p style="margin: 0 0 14px; color: ${EMAIL_BRAND.muted}; font-size: 14px;">
          Đơn giữ chỗ trong <strong>24 giờ</strong>. Chuyển khoản rồi thì cứ báo
          chuyên gia, quá hạn chuyên gia vẫn duyệt được đơn này.
        </p>`,
      button: {
        label: "Xem đơn hàng",
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
  // Đơn chuyển khoản thủ công: tiền về tài khoản chuyên gia, không phải EvonHub
  const receiverName = data.payeeName
    ? `Chuyên gia <strong>${escapeHtml(data.payeeName)}</strong>`
    : "EvonHub";

  return {
    subject: `Xong rồi! ${productName} đã mở cho bạn 🎉`,
    html: renderEmailLayout({
      preview: `Đã nhận ${formatMoney(data.total)} VNĐ cho đơn ${data.code}. Vào học thôi!`,
      heading: "Thanh toán thành công, vào học thôi!",
      body: `
        <p style="margin: 0 0 14px;">
          Chào ${data.username}, ${receiverName} đã nhận được
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
