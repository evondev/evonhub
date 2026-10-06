export const CHAT_MESSAGE_MAX_LENGTH = 1000;

/** Đếm ký tự còn lại khi gần chạm giới hạn, xa thì không làm rối ô nhập */
export const CHAT_MESSAGE_COUNTER_THRESHOLD = 900;

export const CHAT_PAGE_SIZE = 50;

/** Trần số tin lấy bù sau khi mất kết nối, lỡ nhiều hơn thì người dùng kéo lên đọc */
export const CHAT_SYNC_LIMIT = 100;

/** Mỗi người tối đa 1 tin trong khoảng này */
export const CHAT_SEND_INTERVAL_MS = 1000;

/** Tin liền nhau cùng người gửi trong khoảng này thì gộp, ẩn avatar và tên */
export const CHAT_GROUP_WINDOW_MS = 5 * 60 * 1000;

/** Chưa cấu hình Pusher (dev) thì hỏi tin mới theo nhịp này */
export const CHAT_POLL_INTERVAL_MS = 4000;

/** Việt Nam không đổi giờ theo mùa nên lệch UTC cố định +7 */
export const VIETNAM_UTC_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Presence channel: Pusher tự biết ai đang online, cần auth qua /api/pusher/auth */
export const CHAT_CHANNEL_NAME = "presence-chat";

export const CHAT_PUSHER_AUTH_ENDPOINT = "/api/pusher/auth";

export const CHAT_EVENTS = {
  MESSAGE_NEW: "message:new",
  MESSAGE_DELETED: "message:deleted",
} as const;

/** Link trong tin: http(s)://… hoặc www.… */
export const CHAT_LINK_PATTERN = /\bhttps?:\/\/[^\s<>"]+|\bwww\.[^\s<>"]+/gi;

/** Virtuoso cần chỉ số đầu đủ lớn để chèn tin cũ lên trên mà không về âm */
export const CHAT_FIRST_ITEM_INDEX = 1_000_000;

/**
 * Khung chat cao đúng phần còn lại của viewport (trừ header, thanh dưới ở
 * mobile, padding khu nội dung) để trang không cuộn, chỉ danh sách tin cuộn
 */
export const CHAT_FRAME_HEIGHT_CLASS_NAME =
  "h-[calc(100dvh-160px)] sm:h-[calc(100dvh-176px)] lg:h-[calc(100dvh-112px)]";

/** Còn dưới mốc này tới 00:00 thì nhãn hạn xoá đổi sang màu cảnh báo */
export const CHAT_EXPIRY_WARNING_MINUTES = 60;

/** Bề rộng dòng chữ trong khung chờ, khác nhau cho giống tin thật */
export const chatSkeletonLineWidths: string[] = [
  "w-2/3",
  "w-1/2",
  "w-3/4",
  "w-1/3",
  "w-3/5",
  "w-2/5",
];

/** Trang xem trước giả "bây giờ" là 23:40 để thấy nhãn hạn xoá đổi màu */
export const CHAT_PREVIEW_MINUTES_LEFT = 20;

/** Mục trong menu ⋯ của tin nhắn, cùng khuôn menu thao tác ở các trang quản lý */
export const CHAT_MESSAGE_MENU_ITEM_CLASS_NAME =
  "flex h-9 cursor-pointer items-center gap-2 rounded-lg px-2.5 text-sm text-foreground focus:bg-item-hover focus:text-foreground dark:focus:bg-item-hover dark:focus:text-foreground";

/** Số avatar xếp chồng trên đầu khung, còn lại gom vào số đếm */
export const CHAT_STACKED_AVATAR_COUNT = 4;

/** Lỗi dựng sẵn cho trạng thái "Gửi bị chặn" của trang xem trước */
export const CHAT_PREVIEW_BLOCKED_DRAFT = "d.m cái bug này fix cả tối không xong";

export const CHAT_SIGN_IN_REQUIRED_MESSAGE = "Bạn cần đăng nhập để trò chuyện";
export const CHAT_ACCOUNT_LOCKED_MESSAGE = "Tài khoản của bạn đang bị khoá";
export const CHAT_EMPTY_MESSAGE = "Tin nhắn chưa có nội dung";
export const CHAT_TOO_LONG_MESSAGE = `Tin nhắn tối đa ${CHAT_MESSAGE_MAX_LENGTH} ký tự`;
export const CHAT_PROFANITY_MESSAGE =
  "Tin nhắn có từ ngữ không phù hợp, sửa lại rồi gửi nhé";
export const CHAT_RATE_LIMIT_MESSAGE = "Bạn gửi hơi nhanh, chờ một chút nhé";
export const CHAT_SEND_ERROR_MESSAGE = "Chưa gửi được, thử lại sau ít giây";
export const CHAT_DELETE_ERROR_MESSAGE = "Chưa xoá được tin nhắn";
export const CHAT_FORBIDDEN_MESSAGE = "Bạn không có quyền làm việc này";

export { chatEmojis } from "./chat-emoji.constants";
export { chatConversationStarters } from "./chat-starter.constants";
export {
  CHAT_PREVIEW_STATE_LINKS,
  chatPreviewMessageSeeds,
  chatPreviewSenders,
  chatPreviewVisitors,
} from "./chat-preview.constants";
export { chatRoleLabels } from "./chat-role.constants";
export {
  bannedTerms,
  bannedTermsWithDiacritics,
} from "./profanity.constants";
