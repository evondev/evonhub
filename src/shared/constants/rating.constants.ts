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

/** Mức chọn sẵn khi mở hộp đánh giá: "Tuyệt vời" */
export const DEFAULT_RATING = 5;

/** Từ mức này trở lên là hài lòng, gợi ý lời khen; thấp hơn gợi ý điều cần cải thiện */
export const POSITIVE_RATING_MIN = 4;

/** Học tới % này của khóa thì tự mở hộp đánh giá, mỗi khóa một lần */
export const RATING_PROMPT_PERCENT = 20;

export const RATING_PROMPT_STORAGE_KEY_PREFIX = "ratingPromptShown";

// Bấm tag để chèn nhanh vào ô cảm nhận, không có dấu chấm cuối vì được nối thành câu
export const positiveRatingSuggestions: string[] = [
  "Anh giảng dễ hiểu lắm",
  "Học xong làm được dự án thật luôn",
  "Kiến thức thực tế, đi làm dùng được ngay",
  "Giá quá rẻ so với lượng kiến thức",
  "Hỏi gì anh cũng hỗ trợ nhiệt tình",
  "Lộ trình rõ ràng, học không bị rối",
];

export const improvementRatingSuggestions: string[] = [
  "Mong anh thêm nhiều ví dụ hơn",
  "Có đoạn anh nói hơi nhanh",
  "Vài bài hơi cũ, mong anh cập nhật",
  "Âm thanh vài bài hơi nhỏ",
  "Muốn có thêm bài tập để tự làm",
  "Hỏi bài hơi lâu mới được trả lời",
];
