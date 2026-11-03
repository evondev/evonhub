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

/**
 * Bỏ thẻ HTML, giải mã entity, gộp khoảng trắng: dùng cho meta description, mô tả
 * ngắn từ mô tả soạn trong admin. TinyMCE từng lưu chữ Việt dạng kh&oacute;a
 */
export function htmlToPlainText(html: string): string {
  // Thẻ thành khoảng trắng trước để "<p>a</p><p>b</p>" không dính thành "ab"
  const textWithEntities = html.replace(/<[^>]*>/g, " ");
  // Parse thành DOM rồi đọc textContent: mọi entity được giải mã đúng một lần.
  // Phải RETURN_DOM: chuỗi không có "<" thì DOMPurify trả nguyên, không parse
  const decodedText =
    DOMPurify.sanitize(textWithEntities, {
      ALLOWED_TAGS: [],
      RETURN_DOM: true,
    }).textContent || "";

  // \s bắt cả nbsp đã giải mã
  return decodedText.replace(/\s+/g, " ").trim();
}
