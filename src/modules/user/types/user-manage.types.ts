import { UserRole, UserStatus } from "@/shared/constants/user.constants";
import { FacetCountItem } from "@/shared/types/count.types";

/** Tab trên bảng thành viên */
export type UserManageTab = "all" | "paid" | "locked";

export type UserRoleFilter = UserRole | "all";

/** Bộ lọc của trang Quản lý thành viên, lưu trên URL */
export interface UserManageFilters {
  search: string;
  tab: UserManageTab;
  role: UserRoleFilter;
  page: number;
}

/** Phần dữ liệu một thành viên mà bảng cần */
export interface UserManageRow {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: Date | string;
  status: UserStatus;
  role: UserRole;
  courseCount: number;
}

/** Số thành viên của từng tab, đã áp từ khoá và vai trò đang lọc */
export type UserManageTabCounts = Record<UserManageTab, number>;

/** Kết quả $facet đếm của fetchUsers: tổng theo bộ lọc đang xem và từng tab */
export interface UserManageCountFacet {
  total: FacetCountItem[];
  all: FacetCountItem[];
  paid: FacetCountItem[];
  locked: FacetCountItem[];
}

export interface UserManageResult {
  users: UserManageRow[];
  total: number;
  tabCounts: UserManageTabCounts;
}

export interface UserRoleOption {
  value: UserRoleFilter;
  label: string;
}

/** Các trường lọc gửi xuống fetchUsers, suy từ tab và vai trò */
export interface UserManageFetchFilters {
  isPaid: boolean;
  status?: UserStatus;
  role?: UserRole;
}

export type UserManagePreviewState = "du-lieu" | "rong" | "dang-tai" | "loi";

export interface UserManagePreviewStateLink {
  state: UserManagePreviewState;
  label: string;
}

export interface UpdateUserStatusParams {
  userId: string;
  status: UserStatus;
}

export interface UpdateUserStatusResult {
  isSuccess: boolean;
  message?: string;
}
