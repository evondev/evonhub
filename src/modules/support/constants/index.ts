import { FilterTabItem } from "@/shared/types";
import { SupportInboxFilter } from "../types";

export const SUPPORT_MESSAGE_MAX_LENGTH = 1000;

/** Đếm ký tự còn lại khi gần chạm giới hạn, xa thì không làm rối ô nhập */
export const SUPPORT_MESSAGE_COUNTER_THRESHOLD = 900;

/**
 * Admin không bắt buộc trả lời, nên mỗi người chỉ gửi tối đa chừng này tin
 * liền nhau khi chưa được đáp. Admin trả lời thì đếm lại từ đầu
 */
export const SUPPORT_UNANSWERED_LIMIT = 5;

/** Mỗi người tối đa 1 tin trong khoảng này */
export const SUPPORT_SEND_INTERVAL_MS = 1000;

/** Số tin gần nhất tải cho một hội thoại */
export const SUPPORT_THREAD_MESSAGE_LIMIT = 200;

/** Số hội thoại gần nhất trong hộp thư admin */
export const SUPPORT_INBOX_LIMIT = 100;

/** Dòng xem trước tin cuối trong hộp thư */
export const SUPPORT_PREVIEW_MAX_LENGTH = 120;

/** Chưa cấu hình Pusher (dev) thì hỏi tin mới theo nhịp này */
export const SUPPORT_POLL_INTERVAL_MS = 5000;

/**
 * Bắn trên kênh thông báo riêng của người nhận (private-notifications-<id>),
 * không mở kênh mới. Chỉ báo "có tin mới", client tự tải lại
 */
export const SUPPORT_PUSHER_EVENT = "support:message";

/**
 * Khung chat cao đúng phần còn lại của viewport (trừ header, thanh dưới ở
 * mobile, padding khu nội dung) để trang không cuộn, chỉ danh sách tin cuộn
 */
export const SUPPORT_FRAME_HEIGHT_CLASS_NAME =
  "h-[calc(100dvh-160px)] sm:h-[calc(100dvh-176px)] lg:h-[calc(100dvh-112px)]";

/** Như trên, trừ thêm thanh tab của khu quản lý (40px + 24px lề dưới) */
export const SUPPORT_ADMIN_FRAME_HEIGHT_CLASS_NAME =
  "h-[calc(100dvh-224px)] sm:h-[calc(100dvh-240px)] lg:h-[calc(100dvh-176px)]";

export const SUPPORT_SIGN_IN_REQUIRED_MESSAGE = "Bạn cần đăng nhập để nhắn tin";
export const SUPPORT_EMPTY_MESSAGE = "Tin nhắn chưa có nội dung";
export const SUPPORT_TOO_LONG_MESSAGE = `Tin nhắn tối đa ${SUPPORT_MESSAGE_MAX_LENGTH} ký tự`;
export const SUPPORT_PROFANITY_MESSAGE =
  "Tin nhắn có từ ngữ không phù hợp, sửa lại rồi gửi nhé";
export const SUPPORT_RATE_LIMIT_MESSAGE = "Bạn gửi hơi nhanh, chờ một chút nhé";
export const SUPPORT_LIMIT_REACHED_MESSAGE =
  "Bạn đã gửi khá nhiều tin, đợi Admin phản hồi rồi nhắn tiếp nhé";
export const SUPPORT_SEND_ERROR_MESSAGE = "Chưa gửi được, thử lại sau ít giây";
export const SUPPORT_FORBIDDEN_MESSAGE = "Bạn không có quyền làm việc này";
export const SUPPORT_NOT_FOUND_MESSAGE = "Không tìm thấy cuộc trò chuyện này";
export const SUPPORT_ADMIN_SELF_MESSAGE =
  "Admin trả lời học viên ở Hộp thư trong khu quản lý";

export const supportInboxTabs: FilterTabItem<SupportInboxFilter>[] = [
  { value: "all", label: "Tất cả" },
  { value: "unread", label: "Chưa đọc" },
];

export const supportInboxFilters = ["all", "unread"] as const;
