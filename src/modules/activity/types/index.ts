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

export interface LogVideoViewParams {
  videoId: string;
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
  /**
   * Việc có nhịp (học bài, xem video): tính vào tab "Đang học" và hiện thời
   * gian của phiên
   */
  isSession?: boolean;
}

/** Tab xem nhật ký từng dòng */
export type ActivityLogTab = "all" | "online" | ActivityGroup;

/** Tab xếp hạng bài học theo số người học, thay vì liệt kê từng dòng */
export type ActivityTopLessonsTab = "top-lessons";

export type ActivityManageTab = ActivityLogTab | ActivityTopLessonsTab;

/** Bộ lọc của trang Hoạt động, lưu trên URL */
export interface ActivityManageFilters {
  search: string;
  tab: ActivityManageTab;
  /** Rỗng là mọi khoá */
  courseId: string;
  /** Ngày đầu, dạng YYYY-MM-DD theo giờ Việt Nam; rỗng là không chặn đầu */
  from: string;
  /** Ngày cuối (tính cả ngày này), dạng YYYY-MM-DD; rỗng là không chặn cuối */
  to: string;
  page: number;
}

export interface FetchActivitiesParams {
  search?: string;
  tab?: ActivityManageTab;
  courseId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

/** Bộ lọc của tab "Top bài học": như nhật ký, trừ tab */
export type FetchTopLessonsParams = Omit<FetchActivitiesParams, "tab">;

/** Khoảng ngày của bộ lọc, dạng YYYY-MM-DD; hai chuỗi rỗng là mọi ngày */
export interface ActivityDateRange {
  from: string;
  to: string;
}

/** Điều kiện lastSeenAt của bộ lọc ngày; $lt là 0 giờ ngày sau ngày cuối */
export interface ActivityDateRangeQuery {
  $gte?: Date;
  $lt?: Date;
}

export type ActivityDatePresetKey =
  "today" | "yesterday" | "last7Days" | "last30Days";

/** Một lựa chọn nhanh của bộ lọc ngày */
export interface ActivityDatePreset {
  key: ActivityDatePresetKey;
  label: string;
  from: string;
  to: string;
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

/**
 * Số dòng của từng tab nhật ký; tab "Đang học" đếm theo người, không theo
 * dòng. Tab "Top bài học" không ghi số
 */
export type ActivityManageTabCounts = Record<ActivityLogTab, number>;

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
  /** Trang công khai của người làm; rỗng khi người đó đã bị xoá */
  userProfileHref: string;
  detail: string;
  startedAt: string;
  lastSeenAt: string;
}

export type ActivityManagePreviewState =
  "du-lieu" | "rong" | "dang-tai" | "loi";

/** Kết quả $group theo bài của tab "Top bài học" */
export interface TopLessonGroup {
  _id: Types.ObjectId;
  course?: Types.ObjectId;
  /** Số người khác nhau đã mở bài */
  learnerCount: number;
  /** Số phiên học, mỗi lần quay lại sau ACTIVITY_SESSION_GAP_MS là một phiên */
  sessionCount: number;
  /** Tổng thời gian các phiên, từ lúc mở bài tới nhịp cuối */
  totalStudyMs: number;
}

/** Kết quả $facet: một trang bài đã xếp hạng và tổng số bài */
export interface TopLessonFacet {
  lessons: TopLessonGroup[];
  total: { count: number }[];
}

/** Một bài đã xếp hạng, đúng hình fetchTopLessons trả về */
export interface TopLessonItemData {
  lessonId: string;
  /** Thứ hạng trên mọi trang, bắt đầu từ 1 */
  rank: number;
  /** null khi bài đã bị xoá hẳn khỏi DB */
  lesson: ActivityLessonData | null;
  isLessonDeleted: boolean;
  course: ActivityCourseData | null;
  learnerCount: number;
  sessionCount: number;
  totalStudyMinutes: number;
}

export interface FetchTopLessonsResult {
  lessons: TopLessonItemData[];
  total: number;
  tabCounts: ActivityManageTabCounts;
}

/** Phần dữ liệu một bài trong bảng xếp hạng mà danh sách cần */
export interface TopLessonRow {
  id: string;
  rank: number;
  lessonTitle: string;
  /** Trang học của bài; rỗng khi bài hoặc khoá đã bị xoá */
  lessonHref: string;
  courseTitle: string;
  /** Trang giới thiệu khoá; rỗng khi khoá đã bị xoá */
  courseHref: string;
  learnerCount: number;
  sessionCount: number;
  totalStudyMinutes: number;
}

/** Tab nhật ký thì có activities, tab "Top bài học" thì có topLessons */
export interface ActivityManageResult {
  activities: ActivityRow[];
  topLessons: TopLessonRow[];
  total: number;
  tabCounts: ActivityManageTabCounts;
}

export interface FetchLessonLearnersParams {
  lessonId: string;
  courseId: string;
}

/** Một người đang học cùng bài; tên chỉ để dựng chữ cái đầu khi chưa có ảnh */
export interface LessonLearnerAvatar {
  userId: string;
  name: string;
  avatar?: string;
}

/** Người khác đang học cùng bài, đúng hình fetchLessonLearners trả về */
export interface FetchLessonLearnersResult {
  total: number;
  /** Vài người mới nhất để xếp avatar chồng nhau */
  learners: LessonLearnerAvatar[];
}

/** Một người trong $facet "đang học cùng bài", đã lấy tên và ảnh từ User */
export interface LessonLearnerGroup {
  _id: Types.ObjectId;
  name: string;
  avatar?: string;
}

/** Kết quả $facet: tổng số người và vài người mới nhất */
export interface LessonLearnersFacet {
  total: { count: number }[];
  learners: LessonLearnerGroup[];
}
