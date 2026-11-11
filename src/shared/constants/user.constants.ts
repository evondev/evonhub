import type {
  UserLockDurationOption,
  UserLockInput,
} from "../types/user.types";

export enum UserStatus {
  Active = "active",
  Inactive = "inactive",
}
export enum UserPermission {
  CREATE_COURSE = "create:course",
  UPDATE_COURSE = "update:course",
  CREATE_LECTURE = "create:lecture",
  UPDATE_LECTURE = "update:lecture",
  DELETE_LECTURE = "delete:lecture",
  CREATE_LESSON = "create:lesson",
  UPDATE_LESSON = "update:lesson",
  DELETE_LESSON = "delete:lesson",
  CREATE_COMMENT = "create:comment",
  UPDATE_COMMENT = "update:comment",
  DELETE_COMMENT = "delete:comment",
  CREATE_CATEGORY = "create:category",
  UPDATE_CATEGORY = "update:category",
  DELETE_CATEGORY = "delete:category",
  CREATE_REACTION = "create:reaction",
}
/** Trang công khai của một người: /user-profile/<username> */
export const PROFILE_PUBLIC_PATH = "/user-profile";

export enum UserRole {
  Admin = "ADMIN",
  Expert = "EXPERT",
  User = "USER",
}
// Chỉ còn để đọc đơn hàng gói hội viên cũ; tính năng hội viên đã gỡ
export enum MembershipPlan {
  None = "none",
  Personal = "personal",
  Starter = "starter",
  Master = "master",
  Premium = "premium",
}

/** Các mức thời hạn khi khoá tài khoản. null là khoá tới khi admin mở tay */
export enum UserLockDuration {
  OneDay = "1d",
  ThreeDays = "3d",
  SevenDays = "7d",
  ThirtyDays = "30d",
  Forever = "forever",
}

const DAY_MS = 24 * 60 * 60 * 1000;

export const userLockDurationOptions: UserLockDurationOption[] = [
  { value: UserLockDuration.OneDay, label: "1 ngày", durationMs: DAY_MS },
  {
    value: UserLockDuration.ThreeDays,
    label: "3 ngày",
    durationMs: 3 * DAY_MS,
  },
  {
    value: UserLockDuration.SevenDays,
    label: "7 ngày",
    durationMs: 7 * DAY_MS,
  },
  {
    value: UserLockDuration.ThirtyDays,
    label: "30 ngày",
    durationMs: 30 * DAY_MS,
  },
  { value: UserLockDuration.Forever, label: "Vĩnh viễn", durationMs: null },
];

export const USER_LOCK_REASON_MAX_LENGTH = 300;

/** Mức mặc định khi mở hộp khoá: đủ để hạ nhiệt, chưa tới mức đuổi hẳn */
export const DEFAULT_USER_LOCK_INPUT: UserLockInput = {
  duration: UserLockDuration.SevenDays,
  reason: "",
};
