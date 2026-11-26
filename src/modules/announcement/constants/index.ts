/**
 * Slug của video đang giới thiệu trong hộp thông báo. Đổi video thì đổi luôn
 * `FEATURE_ANNOUNCEMENT_ID` để người đã xem đợt trước thấy hộp thêm một lần
 */
export const ANNOUNCED_VIDEO_SLUG = "developer-hoc-tieng-anh-the-nao";

/** Chờ trang hiện xong rồi mới bật hộp, không chặn ngay cú nhìn đầu */
export const FEATURE_ANNOUNCEMENT_DELAY_MS = 800;

/** Tiền tố khoá localStorage ghi "đã xem" theo đợt và theo người, dự phòng khi ghi DB lỗi */
export const FEATURE_ANNOUNCEMENT_STORAGE_KEY_PREFIX =
  "feature-announcement-seen";
