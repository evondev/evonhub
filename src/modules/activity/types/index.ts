import { ActivityType } from "@/shared/constants/activity.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { LucideIcon } from "lucide-react";
import { Document, Schema, Types } from "mongoose";

export interface ActivityModelProps extends Document {
  user: Schema.Types.ObjectId;
  type: ActivityType;
  course?: Schema.Types.ObjectId;
  lesson?: Schema.Types.ObjectId;
  /**
   * Tên thứ bị tác động lúc ghi (chương, hay bài/khoá sắp bị xoá): bài hay khoá
   * đổi tên, bị xoá thì dòng nhật ký vẫn đọc được
   */
  targetTitle?: string;
  /** Một dòng phụ: nội dung bình luận, số sao, mã đơn, các trường đã sửa */
  detail?: string;
  /** Nhịp gần nhất của phiên; với việc làm một lần thì bằng createdAt */
  lastSeenAt: Date;
  createdAt: Date;
}

export interface LogLessonViewParams {
  lessonId: string;
  courseId: string;
}

export interface RecordActivityParams {
  userId: unknown;
  type: ActivityType;
  courseId?: unknown;
  lessonId?: unknown;
  targetTitle?: string;
  detail?: string;
  /**
   * Cùng người, cùng việc, cùng chỗ trong ACTIVITY_SESSION_GAP_MS thì kéo dòng
   * cũ lên thay vì thêm dòng: nhịp đang học, kéo thả sắp xếp nhiều lần
   */
  shouldMergeRecent?: boolean;
}

/** Nhóm việc, mỗi nhóm một tab trên trang Hoạt động */
export type ActivityGroup = "learning" | "purchase" | "account" | "content";

/** Dòng nhật ký nói về cái gì: tên đứng sau động từ */
export type ActivityTarget = "lesson" | "lecture" | "course" | "none";

export type ActivityIconTone = "default" | "success" | "danger";

export interface ActivityTypeConfig {
  /** Động từ đứng trước tên bài / chương / khoá */
  label: string;
  group: ActivityGroup;
  target: ActivityTarget;
  icon: LucideIcon;
  tone: ActivityIconTone;
}

export type ActivityManageTab = "all" | "online" | ActivityGroup;

/** Bộ lọc của trang Hoạt động, lưu trên URL */
export interface ActivityManageFilters {
  search: string;
  tab: ActivityManageTab;
  /** Rỗng là mọi khoá */
  courseId: string;
  page: number;
}

export interface FetchActivitiesParams {
  search?: string;
  tab?: ActivityManageTab;
  courseId?: string;
  page?: number;
  limit?: number;
}

export interface ActivityUserData {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

export interface ActivityCourseData {
  _id: string;
  title: string;
  slug: string;
}

export interface ActivityLessonData {
  _id: string;
  title: string;
}

/** Một dòng nhật ký đã populate, đúng hình fetchActivities trả về */
export interface ActivityItemData {
  _id: string;
  type: ActivityType;
  /** null khi người đó đã bị xoá khỏi hệ thống */
  user: ActivityUserData | null;
  course: ActivityCourseData | null;
  lesson: ActivityLessonData | null;
  targetTitle?: string;
  detail?: string;
  lastSeenAt: string;
  createdAt: string;
}

/** Kết quả $group của tab "Đang học": dòng mới nhất của một người */
export interface OnlineActivityGroup {
  _id: Types.ObjectId;
  activityId: Types.ObjectId;
  lastSeenAt: Date;
}

/** Kết quả $group đếm số dòng theo từng loại việc */
export interface ActivityTypeCountGroup {
  _id: ActivityType;
  count: number;
}

/** Số dòng của từng tab; tab "Đang học" đếm theo người, không theo dòng */
export type ActivityManageTabCounts = Record<ActivityManageTab, number>;

export interface FetchActivitiesResult {
  activities: ActivityItemData[];
  total: number;
  tabCounts: ActivityManageTabCounts;
}

/** Phần dữ liệu một dòng nhật ký mà danh sách cần */
export interface ActivityRow {
  id: string;
  type: ActivityType;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  /** "Admin", "Chuyên gia"; rỗng với học viên */
  userRoleLabel: string;
  /** Tên bài / chương / khoá đứng sau động từ; rỗng khi việc không nhắm vào đâu */
  targetTitle: string;
  courseTitle: string;
  /** Trang giới thiệu khoá; rỗng khi khoá đã bị xoá */
  courseHref: string;
  detail: string;
  startedAt: string;
  lastSeenAt: string;
}

export type ActivityManagePreviewState = "du-lieu" | "rong" | "dang-tai" | "loi";

export interface ActivityManageResult {
  activities: ActivityRow[];
  total: number;
  tabCounts: ActivityManageTabCounts;
}
