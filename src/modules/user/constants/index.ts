import { z } from "zod";
import {
  ProfileData,
  ProfilePayoutField,
  ProfilePayoutFormValues,
  ProfilePreviewState,
  ProfilePreviewStateLink,
  ProfilePublicFormValues,
  ProfileSocialField,
  ProfileSocialFormValues,
} from "../types";

/** Giới thiệu hiện ngay dưới tên trên trang công khai: một hai câu */
export const PROFILE_BIO_MAX_LENGTH = 160;

/** "Đã lưu" ở chân khối tắt sau chừng này */
export const PROFILE_SAVED_HINT_MS = 2000;

/**
 * Một hàng trong khối: nhãn trái 10rem, ô phải; dưới sm nhãn nằm trên ô.
 * sm:items-start để nhãn thẳng ô chứ không tụt xuống giữa ô và dòng gợi ý
 */
export const PROFILE_ROW_CLASS_NAME =
  "grid gap-2 px-4 py-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-start sm:gap-6 sm:px-5";

/** Ô nhãn cao bằng ô nhập (h-11, từ md h-10): nhãn một dòng nằm đúng tâm ô */
export const PROFILE_ROW_LABEL_CLASS_NAME =
  "flex min-w-0 items-center sm:min-h-11 md:min-h-10";

/** Khung chờ vẽ ba hàng ô nhập dưới hàng ảnh */
export const PROFILE_SKELETON_FIELD_COUNT = 3;

/** Thời gian giả lập lưu ở trang xem trước */
export const PROFILE_PREVIEW_SAVE_DELAY_MS = 700;

/** Username nằm trong link trang công khai: không dấu, không khoảng trắng */
export const PROFILE_USERNAME_PATTERN = /^[a-zA-Z0-9._-]+$/;

export const PROFILE_USERNAME_MAX_LENGTH = 40;

export const PROFILE_SAVE_ERROR_MESSAGE = "Chưa lưu được, thử lại sau ít phút";

export const PROFILE_USERNAME_TAKEN_MESSAGE = "Username này đã có người dùng";

export const PROFILE_USERNAME_RESERVED_MESSAGE =
  "Username này dành cho đội ngũ EvonHub, chọn tên khác";

/** Chứa một trong các chữ này (bỏ . _ -, không phân biệt hoa thường) là giả danh đội ngũ */
export const PROFILE_RESERVED_USERNAME_PARTS: string[] = ["evondev", "evonhub"];

/**
 * Trùng đúng một trong các tên này mới chặn: "admin" nằm trong "badminton",
 * "mod" nằm trong "modern" vẫn được
 */
export const PROFILE_RESERVED_USERNAMES: string[] = [
  "admin",
  "administrator",
  "quantri",
  "support",
  "hotro",
  "moderator",
  "mod",
  "staff",
  "root",
  "system",
  "official",
];

/** Trang xem trước: gõ username này rồi Lưu để thấy lỗi trùng ("evondev" thì thấy lỗi tên dành riêng) */
export const PREVIEW_TAKEN_USERNAME = "phuongthao_frontend_mentor";

/** Đường dẫn trang công khai, dùng cho nút đầu trang và gợi ý dưới ô username */
export const PROFILE_PUBLIC_PATH = "/user-profile";

const optionalUrlSchema = z
  .string()
  .trim()
  .url("Dán đủ link, bắt đầu bằng https://")
  .or(z.literal(""));

export const profilePublicSchema: z.ZodType<ProfilePublicFormValues> = z.object(
  {
    name: z.string().trim().min(1, "Nhập họ và tên"),
    username: z
      .string()
      .trim()
      .min(1, "Nhập username")
      .max(
        PROFILE_USERNAME_MAX_LENGTH,
        `Username tối đa ${PROFILE_USERNAME_MAX_LENGTH} ký tự`,
      )
      .regex(
        PROFILE_USERNAME_PATTERN,
        "Chỉ dùng chữ không dấu, số và dấu . _ -",
      ),
    bio: z
      .string()
      .max(
        PROFILE_BIO_MAX_LENGTH,
        `Giới thiệu tối đa ${PROFILE_BIO_MAX_LENGTH} ký tự`,
      ),
  },
);

export const profileSocialSchema: z.ZodType<ProfileSocialFormValues> = z.object(
  {
    facebook: optionalUrlSchema,
    youtube: optionalUrlSchema,
    linkedin: optionalUrlSchema,
  },
);

export const profilePayoutSchema: z.ZodType<ProfilePayoutFormValues> = z.object(
  {
    bankName: z.string().trim(),
    bankNumber: z.string().trim(),
    bankAccount: z.string().trim(),
    bankBranch: z.string().trim(),
  },
);

export const PROFILE_SOCIAL_FIELDS: ProfileSocialField[] = [
  {
    name: "facebook",
    label: "Facebook",
    placeholder: "https://facebook.com/ten-cua-ban",
  },
  {
    name: "youtube",
    label: "YouTube",
    placeholder: "https://youtube.com/@kenh-cua-ban",
  },
  {
    name: "linkedin",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/ten-cua-ban",
  },
];

export const PROFILE_PAYOUT_FIELDS: ProfilePayoutField[] = [
  { name: "bankName", label: "Ngân hàng" },
  { name: "bankNumber", label: "Số tài khoản", inputMode: "numeric" },
  {
    name: "bankAccount",
    label: "Chủ tài khoản",
    hint: "Viết đúng như tên in trên thẻ",
  },
  { name: "bankBranch", label: "Chi nhánh" },
];

export const PROFILE_PREVIEW_STATE_LINKS: ProfilePreviewStateLink[] = [
  { state: "hoc-vien", label: "Học viên" },
  { state: "chuyen-gia", label: "Chuyên gia (có ngân hàng)" },
  { state: "chua-dien", label: "Chưa điền gì" },
  { state: "dang-tai", label: "Đang tải" },
  { state: "loi", label: "Lỗi" },
];

/** Hồ sơ giả cho trang xem trước. Chuyên gia mang ca biên: tên, email dài */
export const PREVIEW_PROFILES: Record<ProfilePreviewState, ProfileData> = {
  "hoc-vien": {
    name: "Trần Minh Khoa",
    username: "minhkhoa.dev",
    email: "minhkhoa.dev@gmail.com",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Sinh viên năm 3, đang học NextJS để làm đồ án tốt nghiệp. Thích UI gọn gàng.",
    socials: {
      facebook: "https://facebook.com/minhkhoa.dev",
      youtube: "",
      linkedin: "https://linkedin.com/in/tran-minh-khoa",
    },
  },
  "chuyen-gia": {
    name: "Nguyễn Hoàng Bảo Ngọc Phương Thảo",
    username: "phuongthao_frontend_mentor",
    email: "nguyen.hoang.bao.ngoc.phuong.thao.frontend@evondev-mentors.com.vn",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Frontend developer 8 năm, mentor React và Tailwind. Viết khoá học cho người mới đi làm.",
    socials: {
      facebook: "https://facebook.com/phuongthao.frontend",
      youtube: "https://youtube.com/@phuongthao-frontend",
      linkedin: "https://linkedin.com/in/phuong-thao-frontend",
    },
    bank: {
      bankName: "Vietcombank",
      bankNumber: "1029384756",
      bankAccount: "NGUYEN HOANG BAO NGOC PHUONG THAO",
      bankBranch: "Chi nhánh Tân Định, TP. Hồ Chí Minh",
    },
  },
  "chua-dien": {
    name: "Lê Hà",
    username: "user_8f3k21",
    email: "leha@gmail.com",
    socials: {},
  },
  "dang-tai": { name: "", username: "", email: "" },
  loi: { name: "", username: "", email: "" },
};
