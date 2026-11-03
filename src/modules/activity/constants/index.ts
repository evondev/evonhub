import { UserRole } from "@/shared/constants/user.constants";
import { FilterTabItem } from "@/shared/types";
import {
  ActivityGroup,
  ActivityManageFilters,
  ActivityManageTab,
} from "../types";

/** Nhật ký tự xoá sau chừng này ngày (TTL index), không phình mãi */
export const ACTIVITY_RETENTION_DAYS = 90;

/** Trang học còn mở thì cứ chừng này gửi một nhịp báo vẫn đang học */
export const ACTIVITY_HEARTBEAT_MS = 2 * 60 * 1000;

/** Có nhịp trong chừng này thì tính là đang học: lỡ một nhịp vẫn chưa rớt */
export const ACTIVITY_ONLINE_WINDOW_MS = 5 * 60 * 1000;

/**
 * Quay lại cùng một bài trong chừng này thì nối vào phiên cũ; lâu hơn là phiên
 * mới, một dòng mới trong nhật ký
 */
export const ACTIVITY_SESSION_GAP_MS = 30 * 60 * 1000;

/** Dòng phụ (nội dung bình luận, đánh giá) chỉ giữ chừng này ký tự */
export const ACTIVITY_DETAIL_MAX_LENGTH = 160;

/** Từ khoá tìm người khớp quá nhiều thì chỉ lấy chừng này người đầu */
export const ACTIVITY_SEARCH_USER_LIMIT = 200;

export const MAX_ACTIVITIES_PER_PAGE = 50;

/** Làm mới danh sách để cột "đang học" và giờ giấc không bị cũ */
export const ACTIVITY_MANAGE_REFETCH_MS = 30 * 1000;

export const ACTIVITY_MANAGE_TAB_VALUES = [
  "all",
  "online",
  "learning",
  "purchase",
  "account",
  "content",
] as const;

export const ACTIVITY_GROUPS: ActivityGroup[] = [
  "learning",
  "purchase",
  "account",
  "content",
];

export const ACTIVITY_MANAGE_TABS: FilterTabItem<ActivityManageTab>[] = [
  { value: "all", label: "Tất cả" },
  { value: "online", label: "Đang học" },
  { value: "learning", label: "Học tập" },
  { value: "purchase", label: "Mua khoá" },
  { value: "account", label: "Tài khoản mới" },
  { value: "content", label: "Nội dung" },
];

/** Bài, khoá, chương hay người đã bị xoá thì hiện chữ này thay tên */
export const ACTIVITY_DELETED_LABELS = {
  user: "Người dùng đã xoá",
  course: "Khoá đã xoá",
  lecture: "Chương không rõ tên",
  lesson: "Bài đã xoá",
};

/** Nhãn cạnh tên người làm; học viên thì không gắn */
export const ACTIVITY_STAFF_ROLE_LABELS: Partial<Record<UserRole, string>> = {
  [UserRole.Admin]: "Admin",
  [UserRole.Expert]: "Chuyên gia",
};

/** Tên tiếng Việt của các trường khoá học, cho dòng "Đổi: giá, mô tả" */
export const COURSE_FIELD_LABELS: Record<string, string> = {
  title: "tên khoá",
  slug: "đường dẫn",
  price: "giá",
  salePrice: "giá gốc",
  desc: "mô tả",
  content: "nội dung",
  image: "ảnh",
  intro: "video giới thiệu",
  level: "trình độ",
  category: "danh mục",
  info: "thông tin khoá",
  cta: "nút kêu gọi",
  ctaLink: "link nút kêu gọi",
  seoKeywords: "từ khoá SEO",
  free: "miễn phí",
  isComingSoon: "sắp ra mắt",
  status: "trạng thái",
};

/** Tên tiếng Việt của các trường bài học, cho dòng "Đổi: tiêu đề, video" */
export const LESSON_FIELD_LABELS: Record<string, string> = {
  title: "tiêu đề",
  slug: "đường dẫn",
  content: "ghi chú bài",
  video: "video",
  assetId: "video",
  iframe: "video Drive",
  duration: "thời lượng",
  trial: "học thử",
  order: "thứ tự",
  lectureId: "chương",
};

export const ACTIVITY_SKELETON_ROW_COUNT = 6;

export const ACTIVITY_MANAGE_DEFAULT_FILTERS: ActivityManageFilters = {
  search: "",
  // Vào trang là xem ai đang học trước
  tab: "online",
  courseId: "",
  page: 1,
};
