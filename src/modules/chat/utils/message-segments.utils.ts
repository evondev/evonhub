import { CHAT_LINK_PATTERN } from "../constants";
import { ChatMessageSegment } from "../types";

/** Dấu câu dính cuối link khi gõ "xem https://a.com." thì không thuộc link */
const TRAILING_PUNCTUATION_PATTERN = /[.,!?;:)\]}'"]+$/;

/** Chỉ nhận http/https; javascript:, data:… trả null để hiện như chữ thường */
function toSafeHref(link: string): string | null {
  const linkWithProtocol = /^https?:\/\//i.test(link) ? link : `https://${link}`;

  try {
    const url = new URL(linkWithProtocol);

    if (url.protocol !== "http:" && url.protocol !== "https:") return null;

    return url.href;
  } catch {
    return null;
  }
}

function appendText(segments: ChatMessageSegment[], text: string) {
  if (!text) return;

  const lastSegment = segments[segments.length - 1];

  if (lastSegment?.type === "text") {
    lastSegment.value += text;
    return;
  }

  segments.push({ type: "text", value: text });
}

/** Tách tin thành chữ và link để render, không bao giờ coi nội dung là HTML */
export function parseMessageSegments(content: string): ChatMessageSegment[] {
  const segments: ChatMessageSegment[] = [];
  let cursor = 0;

  for (const match of Array.from(content.matchAll(CHAT_LINK_PATTERN))) {
    const matchIndex = match.index ?? 0;
    const trailingPunctuation =
      match[0].match(TRAILING_PUNCTUATION_PATTERN)?.[0] ?? "";
    const link = match[0].slice(0, match[0].length - trailingPunctuation.length);
    const href = toSafeHref(link);

    appendText(segments, content.slice(cursor, matchIndex));

    if (href) segments.push({ type: "link", value: link, href });
    if (!href) appendText(segments, link);

    appendText(segments, trailingPunctuation);
    cursor = matchIndex + match[0].length;
  }

  appendText(segments, content.slice(cursor));

  return segments;
}
