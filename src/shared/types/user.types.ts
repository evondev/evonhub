import {
  UserLockDuration,
  UserPermission,
  UserRole,
  UserStatus,
} from "@/shared/constants/user.constants";
import { Document, Schema } from "mongoose";
import { CourseItemData } from "./course.types";

/** Thông tin lần khoá đang có hiệu lực, chỉ có khi status là Inactive do admin khoá */
export interface UserLock {
  reason: string;
  /** Hết hạn lúc này thì tự mở khoá; null là khoá tới khi admin mở tay */
  until: Date | null;
  at: Date;
}

export interface UserLockDurationOption {
  value: UserLockDuration;
  label: string;
  /** Số mili giây khoá; null là vĩnh viễn */
  durationMs: number | null;
}

/** Admin chọn khi khoá: bao lâu và vì sao */
export interface UserLockInput {
  duration: UserLockDuration;
  reason: string;
}

/** Người sắp bị khoá, đủ để hộp xác nhận ghi rõ là ai */
export interface UserLockTarget {
  name: string;
  email?: string;
}

export interface UserModelProps extends Document {
  _id: string;
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  avatar: string;
  courses: Schema.Types.ObjectId[];
  liked: Schema.Types.ObjectId[];
  status: UserStatus;
  role: string;
  createdAt: Date;
  permissions?: UserPermission[];
  bank: {
    bankAccount: string;
    bankName: string;
    bankNumber: string;
    bankBranch: string;
  };
  notificationsSeenAt?: Date;
  lock?: UserLock;
  _destroy: boolean;
  socials: {
    facebook?: string;
    youtube?: string;
    linkedin?: string;
  };
}
export interface UserItemData extends Omit<UserModelProps, "courses" | "role"> {
  courses: CourseItemData[];
  role: UserRole;
}
export interface UserInfoData extends Omit<UserModelProps, "courses" | "role"> {
  courses: string[];
  role: UserRole;
}
