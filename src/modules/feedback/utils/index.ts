import { buildPublicProfilePath } from "@/shared/helpers";
import { FEEDBACK_PROMPT_SHOWN_STORAGE_KEY } from "../constants";
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
