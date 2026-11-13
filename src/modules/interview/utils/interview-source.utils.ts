import { INTERVIEW_SOURCE_DOMAINS } from "../constants";

/** Link https thuộc một trong các domain tài liệu chính chủ */
export function isAllowedSourceUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url.trim());

    if (parsedUrl.protocol !== "https:") return false;

    return INTERVIEW_SOURCE_DOMAINS.some(
      (domain) => parsedUrl.hostname === domain.host,
    );
  } catch {
    return false;
  }
}

/** Bỏ #hash và dấu / cuối để so hai link cùng một trang */
export function normalizeSourceUrl(url: string): string {
  try {
    const parsedUrl = new URL(url.trim());
    parsedUrl.hash = "";
    parsedUrl.search = "";

    return parsedUrl.toString().replace(/\/$/, "");
  } catch {
    return url.trim();
  }
}

/**
 * Chuẩn hoá chữ trước khi so đoạn trích: chữ thường, nháy cong thành nháy thẳng,
 * gạch dài thành gạch ngắn, gộp khoảng trắng. Trang tài liệu và AI hay lệch nhau
 * ở mấy chỗ này dù cùng một câu
 */
export function normalizeQuoteText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[‘’‛]/g, "'")
    .replace(/[“”‟]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/\s+/g, " ")
    .trim();
}

/** Đoạn trích có thật trong chữ của trang tài liệu không */
export function isQuoteInText(quote: string, pageText: string): boolean {
  const normalizedQuote = normalizeQuoteText(quote).replace(/^["']|["']$/g, "");

  if (normalizedQuote.length < 12) return false;

  return normalizeQuoteText(pageText).includes(normalizedQuote);
}

/** Lấy phần nội dung chính của trang (main, article), bỏ script, style, svg */
export function extractMainHtml(html: string): string {
  const withoutBlocks = html.replace(
    /<(script|style|svg|noscript|template|nav|footer)\b[\s\S]*?<\/\1>/gi,
    " ",
  );
  const mainMatch =
    withoutBlocks.match(/<main\b[\s\S]*?<\/main>/i) ||
    withoutBlocks.match(/<article\b[\s\S]*?<\/article>/i);

  return mainMatch ? mainMatch[0] : withoutBlocks;
}

/** Tiêu đề trang từ thẻ title, bỏ đuôi " – React" */
export function extractHtmlTitle(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);

  if (!titleMatch) return "";

  return titleMatch[1]
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .split(/\s[–|-]\s/)[0]
    .trim();
}
