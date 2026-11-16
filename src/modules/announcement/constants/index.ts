/** Trang 3D khu đất theo bậc học, mỗi người một đường dẫn `/house/<username>` */
export const HOUSE_PATH = "/house";

/** Chờ trang hiện xong rồi mới bật hộp, không chặn ngay cú nhìn đầu */
export const FEATURE_ANNOUNCEMENT_DELAY_MS = 800;

/** Tiền tố khoá localStorage ghi "đã xem" theo đợt và theo người, dự phòng khi ghi DB lỗi */
export const FEATURE_ANNOUNCEMENT_STORAGE_KEY_PREFIX =
  "feature-announcement-seen";
