import { UserRole, UserStatus } from "@/shared/constants/user.constants";
import { UserItemData } from "@/shared/types/user.types";
import { FilterTabItem } from "@/shared/types";
import dayjs from "dayjs";
import {
  USER_MANAGE_TABS,
  USER_MANAGE_UPDATE_PATH,
} from "../constants/user-manage.constants";
import {
  UserManageFetchFilters,
  UserManageFilters,
  UserManageRow,
  UserManageTab,
  UserManageTabCounts,
} from "../types/user-manage.types";

export function toUserManageRow(user: UserItemData): UserManageRow {
  return {
    id: user._id.toString(),
    name: user.name,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    createdAt: user.createdAt,
    status: user.status,
    role: user.role,
    courseCount: user.courses?.length || 0,
  };
}

/** Tab "Đã trả phí" lọc theo khoá, tab "Bị khoá" lọc theo trạng thái */
export function getUserManageFetchFilters(
  filters: UserManageFilters,
): UserManageFetchFilters {
  return {
    isPaid: filters.tab === "paid",
    status: filters.tab === "locked" ? UserStatus.Inactive : undefined,
    role: filters.role === "all" ? undefined : filters.role,
  };
}

/** Trang thêm/gỡ khoá học của thành viên */
export function buildUserManageHref(user: UserManageRow): string {
  const params = new URLSearchParams({
    username: user.username,
    email: user.email,
  });

  return `${USER_MANAGE_UPDATE_PATH}?${params.toString()}`;
}

export function formatUserJoinedDate(date: Date | string): string {
  return dayjs(date).format("DD/MM/YYYY");
}

export function isLockedUser(user: UserManageRow): boolean {
  return user.status === UserStatus.Inactive;
}

/** Vai trò thường gặp nhất thì chữ nhạt, để quản trị viên, chuyên gia nổi lên */
export function isDefaultRole(role: UserRole): boolean {
  return role === UserRole.User;
}

/** Gắn số đếm vào tab; chưa có số (lần tải đầu) thì tab chỉ ghi chữ */
export function buildUserManageTabs(
  tabCounts?: UserManageTabCounts,
): FilterTabItem<UserManageTab>[] {
  return USER_MANAGE_TABS.map((tab) => ({
    ...tab,
    count: tabCounts?.[tab.value],
  }));
}

/** Số đếm từng tab của trang xem trước, tính trên danh sách giả như server sẽ đếm */
export function countPreviewUserTabs(
  users: UserManageRow[],
  filters: UserManageFilters,
): UserManageTabCounts {
  return {
    all: filterPreviewUsers(users, { ...filters, tab: "all" }).length,
    paid: filterPreviewUsers(users, { ...filters, tab: "paid" }).length,
    locked: filterPreviewUsers(users, { ...filters, tab: "locked" }).length,
  };
}

/** Trang xem trước lọc tại chỗ trên danh sách giả, như server sẽ lọc */
export function filterPreviewUsers(
  users: UserManageRow[],
  filters: UserManageFilters,
): UserManageRow[] {
  const keyword = filters.search.trim().toLowerCase();
  const fetchFilters = getUserManageFetchFilters(filters);

  return users.filter((user) => {
    const isKeywordMatch =
      !keyword ||
      [user.name, user.username, user.email].some((field) =>
        field.toLowerCase().includes(keyword),
      );
    const isPaidMatch = !fetchFilters.isPaid || user.courseCount > 0;
    const isStatusMatch =
      !fetchFilters.status || user.status === fetchFilters.status;
    const isRoleMatch = !fetchFilters.role || user.role === fetchFilters.role;

    return isKeywordMatch && isPaidMatch && isStatusMatch && isRoleMatch;
  });
}
