import DOMPurify from "isomorphic-dompurify";

/** Chèn chữ do người dùng đặt (tên, tiêu đề) vào chuỗi HTML mà không thành thẻ */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Làm sạch HTML soạn trong admin (nội dung bài, mô tả khóa, thông báo) trước khi lưu
 * và trước khi hiện: giữ thẻ định dạng, bỏ script, onerror=, javascript: link.
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } });
}

/** Bỏ thẻ HTML, gộp khoảng trắng: dùng cho meta description từ mô tả soạn trong admin */
export function htmlToPlainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
