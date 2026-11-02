import {
  improvementRatingSuggestions,
  POSITIVE_RATING_MIN,
  positiveRatingSuggestions,
  RATING_PROMPT_STORAGE_KEY_PREFIX,
} from "../constants/rating.constants";

/** Hài lòng thì gợi ý lời khen, chưa hài lòng thì gợi ý điều cần cải thiện */
export function getRatingSuggestions(rating: number): string[] {
  if (rating >= POSITIVE_RATING_MIN) return positiveRatingSuggestions;

  return improvementRatingSuggestions;
}

export function hasRatingSuggestion(content: string, suggestion: string) {
  return content.includes(suggestion);
}

/**
 * Bấm tag lần đầu thì nối vào cuối thành một câu mới, bấm lần nữa thì gỡ ra:
 * "A" + "B" → "A. B", gỡ "A" khỏi "A. B" → "B"
 */
export function toggleRatingSuggestion(
  content: string,
  suggestion: string,
): string {
  const trimmedContent = content.trim();

  if (hasRatingSuggestion(trimmedContent, suggestion)) {
    return trimmedContent
      .replace(suggestion, "")
      .replace(/\.\s*\./g, ".")
      .replace(/^[\s.]+/, "")
      .replace(/[ \t]{2,}/g, " ")
      .trim();
  }

  if (!trimmedContent) return suggestion;

  const endsWithPunctuation = /[.!?…]$/.test(trimmedContent);

  if (endsWithPunctuation) return `${trimmedContent} ${suggestion}`;

  return `${trimmedContent}. ${suggestion}`;
}

function getRatingPromptStorageKey(userId: string, courseId: string) {
  return `${RATING_PROMPT_STORAGE_KEY_PREFIX}:${userId}:${courseId}`;
}

/** Đã tự mở hộp đánh giá khóa này cho user này chưa. Không đọc được storage thì coi như rồi */
export function hasShownRatingPrompt(userId: string, courseId: string) {
  try {
    return (
      localStorage.getItem(getRatingPromptStorageKey(userId, courseId)) === "1"
    );
  } catch {
    return true;
  }
}

export function markRatingPromptShown(userId: string, courseId: string) {
  try {
    localStorage.setItem(getRatingPromptStorageKey(userId, courseId), "1");
  } catch {
    // Storage bị chặn: lần sau có thể nhắc lại, không ảnh hưởng gì khác
  }
}
