import { EReactionType } from "@/types/enums";

/** Inactive là chờ duyệt (mặc định khi tạo); Rejected ẩn hẳn, không còn nằm trong hàng chờ */
export enum RatingStatus {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Rejected = "REJECTED",
}

// Nhãn tiếng Việt cho 5 mức cảm xúc trong hộp đánh giá khóa học
export const reactionLabels: Record<EReactionType, string> = {
  [EReactionType.AWESOME]: "Tuyệt vời",
  [EReactionType.GOOD]: "Tốt",
  [EReactionType.MEH]: "Bình thường",
  [EReactionType.BAD]: "Tệ",
  [EReactionType.TERRIBLE]: "Rất tệ",
};
