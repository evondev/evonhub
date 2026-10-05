import { UserRole, UserStatus } from "@/shared/constants/user.constants";
import { FilterTabItem } from "@/shared/types";
import {
  UserManageFilters,
  UserManagePreviewStateLink,
  UserManageRow,
  UserManageTab,
  UserManageTabCounts,
  UserRoleOption,
} from "../types/user-manage.types";

export const USER_MANAGE_TABS: FilterTabItem<UserManageTab>[] = [
  { value: "all", label: "Tất cả" },
  { value: "paid", label: "Đã trả phí" },
  { value: "locked", label: "Bị khoá" },
];

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.User]: "Học viên",
  [UserRole.Expert]: "Chuyên gia",
  [UserRole.Admin]: "Quản trị viên",
};

export const USER_ROLE_FILTER_OPTIONS: UserRoleOption[] = [
  { value: "all", label: "Tất cả vai trò" },
  { value: UserRole.User, label: USER_ROLE_LABELS[UserRole.User] },
  { value: UserRole.Expert, label: USER_ROLE_LABELS[UserRole.Expert] },
  { value: UserRole.Admin, label: USER_ROLE_LABELS[UserRole.Admin] },
];

export const USER_MANAGE_DEFAULT_FILTERS: UserManageFilters = {
  search: "",
  tab: "all",
  role: "all",
  page: 1,
};

/** Khung chờ vẽ chừng này dòng, gần bằng một trang thật */
export const USER_MANAGE_SKELETON_ROW_COUNT = 8;

export const USER_STATUS_FORBIDDEN_MESSAGE =
  "Chỉ quản trị viên mới đổi được trạng thái thành viên";

export const USER_STATUS_SELF_LOCK_MESSAGE =
  "Không tự khoá tài khoản của chính mình được";

export const USER_STATUS_NOT_FOUND_MESSAGE = "Không tìm thấy thành viên này";

export const USER_STATUS_SAVE_ERROR_MESSAGE =
  "Chưa đổi được trạng thái, thử lại sau ít phút";

/** Thời gian giả lập lưu ở trang xem trước */
export const USER_MANAGE_PREVIEW_SAVE_DELAY_MS = 700;

/** Trang thêm/gỡ khoá học cho một thành viên */
export const USER_MANAGE_UPDATE_PATH = "/admin/user/update";

export const USER_MANAGE_PREVIEW_STATE_LINKS: UserManagePreviewStateLink[] = [
  { state: "du-lieu", label: "Có dữ liệu" },
  { state: "rong", label: "Rỗng do tìm" },
  { state: "dang-tai", label: "Đang tải" },
  { state: "loi", label: "Lỗi" },
];

/** Trang xem trước giả như đang xem trang đầu của cả danh sách thật */
export const USER_MANAGE_PREVIEW_TAB_COUNTS: UserManageTabCounts = {
  all: 4349,
  paid: 1286,
  locked: 37,
};

/** Từ khoá trang xem trước dùng cho trạng thái "Rỗng do tìm" */
export const USER_MANAGE_PREVIEW_EMPTY_KEYWORD = "nguyenthiphuongthao.ketoan";

const portrait = (gender: "men" | "women", index: number) =>
  `https://randomuser.me/api/portraits/${gender}/${index}.jpg`;

/** Thành viên giả cho trang xem trước: có tên dài, không ảnh, bị khoá, 0 khoá */
export const PREVIEW_MANAGED_USERS: UserManageRow[] = [
  {
    id: "u01",
    name: "Trần Thị Vy",
    username: "iris-551",
    email: "ttvy166@gmail.com",
    avatar: portrait("women", 44),
    createdAt: "2026-10-05T08:12:00.000Z",
    status: UserStatus.Active,
    role: UserRole.User,
    courseCount: 2,
  },
  {
    id: "u02",
    name: "Lê Hoàng Anh",
    username: "usedtobe",
    email: "leagold777@gmail.com",
    createdAt: "2026-10-03T14:40:00.000Z",
    status: UserStatus.Active,
    role: UserRole.User,
    courseCount: 0,
  },
  {
    id: "u03",
    name: "Nguyễn Thị Phương Thảo Nguyên",
    username: "phuongthao.nguyen.frontend",
    email: "nguyenthiphuongthao.frontend.developer@outlook.com",
    avatar: portrait("women", 68),
    createdAt: "2026-10-02T03:05:00.000Z",
    status: UserStatus.Active,
    role: UserRole.User,
    courseCount: 7,
  },
  {
    id: "u04",
    name: "Phạm Minh Khoa",
    username: "khoapham",
    email: "khoa.pham@evonhub.dev",
    avatar: portrait("men", 32),
    createdAt: "2026-09-28T10:20:00.000Z",
    status: UserStatus.Active,
    role: UserRole.Expert,
    courseCount: 12,
  },
  {
    id: "u05",
    name: "Đỗ Quang Huy",
    username: "huydo.dev",
    email: "huydq.dev@gmail.com",
    avatar: portrait("men", 75),
    createdAt: "2026-09-27T16:45:00.000Z",
    status: UserStatus.Inactive,
    role: UserRole.User,
    courseCount: 1,
  },
  {
    id: "u06",
    name: "Võ Ngọc Bảo Trân",
    username: "baotran",
    email: "baotran.vo@yahoo.com",
    avatar: portrait("women", 12),
    createdAt: "2026-09-25T09:00:00.000Z",
    status: UserStatus.Active,
    role: UserRole.User,
    courseCount: 3,
  },
  {
    id: "u07",
    name: "Evondev",
    username: "evondev",
    email: "trananhtuan400@gmail.com",
    avatar: portrait("men", 11),
    createdAt: "2024-03-04T02:00:00.000Z",
    status: UserStatus.Active,
    role: UserRole.Admin,
    courseCount: 24,
  },
  {
    id: "u08",
    name: "Hoàng Gia Bảo",
    username: "giabao2003",
    email: "giabao2003@gmail.com",
    avatar: portrait("men", 52),
    createdAt: "2026-09-21T12:30:00.000Z",
    status: UserStatus.Active,
    role: UserRole.User,
    courseCount: 0,
  },
  {
    id: "u09",
    name: "Bùi Thanh Tâm",
    username: "tambt",
    email: "tam.bui.thanh@gmail.com",
    createdAt: "2026-09-18T07:15:00.000Z",
    status: UserStatus.Inactive,
    role: UserRole.User,
    courseCount: 0,
  },
  {
    id: "u10",
    name: "Đặng Thu Hà",
    username: "thuha.dang",
    email: "thuha.dang@gmail.com",
    avatar: portrait("women", 29),
    createdAt: "2026-09-15T05:50:00.000Z",
    status: UserStatus.Active,
    role: UserRole.User,
    courseCount: 4,
  },
];

/** Trường fetchUsers trả về cho bảng thành viên: không có bank, password, permissions */
export const USER_MANAGE_LIST_FIELDS =
  "_id clerkId name username email avatar createdAt status role courses";
