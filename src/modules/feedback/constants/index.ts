/** Mỗi ô nhập tối đa bấy nhiêu ký tự, client lẫn server cùng chặn */
export const FEEDBACK_TEXT_MAX_LENGTH = 1000;

/** Một người gửi tối đa bấy nhiêu góp ý trong 24 giờ, chặn spam */
export const FEEDBACK_DAILY_LIMIT = 5;

/** Trang admin xin tối đa bấy nhiêu dòng một trang */
export const MAX_FEEDBACKS_PER_PAGE = 50;

/** Tìm người theo từ khoá: lấy tối đa bấy nhiêu user khớp để lọc góp ý */
export const FEEDBACK_SEARCH_USER_LIMIT = 200;

export const FEEDBACK_SKELETON_ROW_COUNT = 5;

/** Chờ trang hiện xong rồi mới bật hộp, không chặn ngay cú nhìn đầu */
export const FEEDBACK_PROMPT_DELAY_MS = 1500;

/**
 * Đã tự bật hộp trong phiên này (tab này) chưa. Đóng mà chưa gửi thì lần truy
 * cập sau (tab mới) mới bật lại, tải lại trang cùng tab thì không
 */
export const FEEDBACK_PROMPT_SHOWN_STORAGE_KEY = "feedback-prompt-shown";

export const FEEDBACK_MANAGE_DEFAULT_FILTERS = {
  search: "",
  page: 1,
};
