export const EMAIL_BRAND = {
  siteUrl: "https://evonhub.dev",
  logoUrl: "https://evonhub.dev/logo-main.png",
  primary: "#978df8",
  text: "#171725",
  muted: "#6b7280",
  border: "#e5e7eb",
  background: "#f4f4f7",
};

export interface EmailButton {
  label: string;
  url: string;
}

export interface EmailLayoutProps {
  /** Dòng xem trước hiện cạnh tiêu đề trong hộp thư */
  preview: string;
  heading: string;
  /** Nội dung chính, đã là HTML */
  body: string;
  button?: EmailButton;
  footerNote?: string;
}

/**
 * Khung email dùng chung cho mọi email giao dịch: header logo, thẻ nội dung,
 * nút CTA và footer. Toàn bộ style viết inline vì phần lớn client email bỏ CSS
 * ngoài, và dùng table để Outlook không vỡ layout.
 */
export function renderEmailLayout({
  preview,
  heading,
  body,
  button,
  footerNote,
}: EmailLayoutProps): string {
  const buttonHtml = button
    ? `
      <tr>
        <td style="padding: 8px 0 4px;">
          <a href="${button.url}"
             style="display: inline-block; background: ${EMAIL_BRAND.primary}; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 28px; border-radius: 999px;">
            ${button.label}
          </a>
        </td>
      </tr>`
    : "";

  return `
<div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">${preview}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: ${EMAIL_BRAND.background}; padding: 32px 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
  <tr>
    <td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background: #ffffff; border: 1px solid ${EMAIL_BRAND.border}; border-radius: 16px; overflow: hidden;">
        <tr>
          <td style="padding: 24px 28px 0;">
            <a href="${EMAIL_BRAND.siteUrl}" style="text-decoration: none; color: ${EMAIL_BRAND.text};">
              <img src="${EMAIL_BRAND.logoUrl}" width="36" height="36" alt="EvonHub" style="vertical-align: middle; border: 0;" />
              <span style="font-size: 18px; font-weight: 800; letter-spacing: -0.3px; margin-left: 8px; vertical-align: middle;">EvonHub</span>
            </a>
          </td>
        </tr>
        <tr>
          <td style="padding: 20px 28px 28px; color: ${EMAIL_BRAND.text}; font-size: 15px; line-height: 1.65;">
            <h1 style="margin: 0 0 16px; font-size: 21px; line-height: 1.35; font-weight: 800; letter-spacing: -0.3px;">${heading}</h1>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="font-size: 15px; line-height: 1.65;">${body}</td></tr>
              ${buttonHtml}
            </table>
          </td>
        </tr>
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px;">
        <tr>
          <td style="padding: 16px 28px; color: ${EMAIL_BRAND.muted}; font-size: 12px; line-height: 1.6;">
            ${footerNote ? `${footerNote}<br /><br />` : ""}
            Email này được gửi tự động từ <a href="${EMAIL_BRAND.siteUrl}" style="color: ${EMAIL_BRAND.muted};">evonhub.dev</a>.
            Cần hỗ trợ, bạn cứ trả lời thẳng email này.
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

/** Bảng thông tin dạng nhãn — giá trị, dùng trong email hướng dẫn thanh toán. */
export function renderInfoRows(rows: { label: string; value: string }[]): string {
  const cells = rows
    .map(
      ({ label, value }) => `
        <tr>
          <td style="padding: 9px 0; color: ${EMAIL_BRAND.muted}; font-size: 14px;">${label}</td>
          <td style="padding: 9px 0; text-align: right; font-weight: 700; font-size: 14px;">${value}</td>
        </tr>`
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid ${EMAIL_BRAND.border}; border-radius: 12px; padding: 6px 16px; margin: 4px 0 18px;">
      ${cells}
    </table>`;
}
