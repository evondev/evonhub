import { buildPublicProfilePath } from "@/shared/helpers";
import { cn } from "@/shared/utils";
import {
  FEEDBACK_PROMPT_SHOWN_STORAGE_KEY,
  feedbackEnglishOptions,
} from "../constants";
import { FeedbackItemData, FeedbackRow } from "../types";

const DELETED_USER_LABEL = "Tài khoản đã xoá";

export function toFeedbackRow(feedback: FeedbackItemData): FeedbackRow {
  return {
    id: feedback._id,
    userName: feedback.user?.name || DELETED_USER_LABEL,
    userAvatar: feedback.user?.avatar,
    userProfileHref: feedback.user?.username
      ? buildPublicProfilePath(encodeURIComponent(feedback.user.username))
      : "",
    courseWish: feedback.courseWish || "",
    featureWish: feedback.featureWish || "",
    englishAnswer: getFeedbackEnglishAdminLabel(feedback.wantsEnglish),
    createdAt: feedback.createdAt,
  };
}

/** Phiên này đã tự bật hộp góp ý chưa. Không đọc được storage thì coi như rồi */
export function hasShownFeedbackPrompt(): boolean {
  try {
    return sessionStorage.getItem(FEEDBACK_PROMPT_SHOWN_STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

export function markFeedbackPromptShown() {
  try {
    sessionStorage.setItem(FEEDBACK_PROMPT_SHOWN_STORAGE_KEY, "1");
  } catch {
    // Storage bị chặn: lần tải sau có thể bật lại, không ảnh hưởng gì khác
  }
}

/** Câu trả lời tiếng Anh giao tiếp ra chữ cho admin; không trả lời thì rỗng */
export function getFeedbackEnglishAdminLabel(wantsEnglish?: boolean): string {
  if (typeof wantsEnglish !== "boolean") return "";

  const matchedOption = feedbackEnglishOptions.find(
    (option) => option.value === wantsEnglish,
  );

  return matchedOption?.adminLabel || "";
}

/** Nút chọn dạng thẻ: đang chọn thì viền nhấn + ring mờ như ô nhập đang focus */
export function getFeedbackOptionClassName(isSelected: boolean): string {
  return cn(
    "flex h-10 cursor-pointer items-center justify-center rounded-xl border px-4 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary/30",
    isSelected && "border-primary bg-primary/10 text-primary",
    !isSelected && "border-border-strong text-foreground hover:bg-button-hover",
  );
}
