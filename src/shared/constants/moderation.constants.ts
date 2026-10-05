/** Ô chọn 16px trong dòng: thêm vùng bấm vô hình 40px quanh ô */
export const CHECKBOX_HIT_AREA_CLASS_NAME =
  "relative before:absolute before:-inset-3 before:content-['']";

/** Nội dung ngắn hơn chừng này ký tự (và không xuống dòng) thì không cần "Xem thêm" */
export const EXPANDABLE_TEXT_MIN_LENGTH = 220;

/** Mục chờ duyệt lâu hơn chừng này thì thời gian tô hổ phách */
export const MODERATION_STALE_PENDING_HOURS = 48;

export const MODERATION_SAVE_ERROR_MESSAGE =
  "Chưa đổi được trạng thái, thử lại sau ít phút";

/** Bỏ tick tối đa chừng này mục khi đã chọn cả bộ lọc */
export const MAX_EXCLUDED_IDS = 200;

export const MODERATION_DELETE_ERROR_MESSAGE =
  "Chưa xoá được, thử lại sau ít phút";
