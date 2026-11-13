import { htmlToPlainText } from "@/shared/helpers/html.helper";
import {
  INTERVIEW_DOC_CHAR_LIMIT,
  INTERVIEW_DOC_FETCH_TIMEOUT_MS,
} from "../constants";
import {
  InterviewAdminSource,
  InterviewDocPage,
  InterviewSourceValues,
} from "../types";
import {
  extractHtmlTitle,
  extractMainHtml,
  isAllowedSourceUrl,
  isQuoteInText,
  normalizeSourceUrl,
} from "../utils/interview-source.utils";

/** Tải một trang tài liệu chính chủ, lấy chữ phần nội dung chính. Lỗi thì null */
export async function fetchDocPage(
  url: string,
): Promise<InterviewDocPage | null> {
  if (!isAllowedSourceUrl(url)) return null;

  try {
    const response = await fetch(normalizeSourceUrl(url), {
      signal: AbortSignal.timeout(INTERVIEW_DOC_FETCH_TIMEOUT_MS),
      headers: { "User-Agent": "Mozilla/5.0 (compatible; DocFetcher/1.0)" },
      // Tài liệu ít đổi: cache một ngày, tạo nhiều lô cùng trang không tải lại
      next: { revalidate: 60 * 60 * 24 },
    });

    if (!response.ok) return null;

    const html = await response.text();
    const text = htmlToPlainText(extractMainHtml(html));

    if (!text) return null;

    return {
      url: normalizeSourceUrl(url),
      title: extractHtmlTitle(html),
      text: text.slice(0, INTERVIEW_DOC_CHAR_LIMIT),
    };
  } catch (error) {
    console.log("fetchDocPage error:", url, error);

    return null;
  }
}

/** Tải nhiều trang cùng lúc, bỏ trang lỗi */
export async function fetchDocPages(urls: string[]): Promise<InterviewDocPage[]> {
  const uniqueUrls = [...new Set(urls.map(normalizeSourceUrl))];
  const docPages = await Promise.all(uniqueUrls.map(fetchDocPage));

  return docPages.filter((docPage): docPage is InterviewDocPage => Boolean(docPage));
}

/**
 * Kiểm đoạn trích của từng nguồn có thật trong trang không. Trang đã tải sẵn
 * (lúc AI tạo) thì dùng lại, chưa có thì tải
 */
export async function verifySources(
  sources: InterviewSourceValues[],
  loadedPages: InterviewDocPage[] = [],
): Promise<InterviewAdminSource[]> {
  const pagesByUrl = new Map(loadedPages.map((docPage) => [docPage.url, docPage]));
  const missingUrls = sources
    .filter((source) => source.quote && !pagesByUrl.has(normalizeSourceUrl(source.url)))
    .map((source) => source.url);

  for (const docPage of await fetchDocPages(missingUrls)) {
    pagesByUrl.set(docPage.url, docPage);
  }

  return sources.map((source) => {
    const docPage = pagesByUrl.get(normalizeSourceUrl(source.url));

    return {
      url: source.url,
      title: source.title || docPage?.title || "",
      quote: source.quote,
      isQuoteVerified: Boolean(
        docPage && source.quote && isQuoteInText(source.quote, docPage.text),
      ),
    };
  });
}
