import { Document, Schema } from "mongoose";

export type LeaderboardPeriod = "week" | "month" | "all";

export interface LeaderboardPeriodTab {
  value: LeaderboardPeriod;
  label: string;
  /** Tiêu đề thẻ của bạn ở kỳ này */
  meTitle: string;
  /** Đuôi câu đếm ở chân bảng: "1.284 học viên có phút tuần này" */
  participantLabel: string;
  /** Thẻ của bạn khi chưa có phút nào trong kỳ */
  emptyText: string;
  /** Đuôi danh hiệu top 3: "Dẫn đầu tuần" */
  rankTitleSuffix: string;
}

export interface LeaderboardViewer {
  userId: string;
  /** Rỗng thì tên, avatar không thành link trang công khai */
  username: string;
  name: string;
  avatar: string;
}

/** Các ô 10 giây của một bài mà một người đã xem trọn */
export interface LessonWatchModelProps extends Document {
  user: Schema.Types.ObjectId;
  lesson: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  buckets: number[];
  updatedAt: Date;
}

/** Số giây học của một người trong một ngày (giờ Việt Nam) */
export interface StudyDayModelProps extends Document {
  user: Schema.Types.ObjectId;
  /** "2026-11-05" */
  day: string;
  seconds: number;
}

/** Tổng giây học từ trước tới nay của một người, kèm mốc lần cộng gần nhất */
export interface StudyTotalModelProps extends Document {
  user: Schema.Types.ObjectId;
  seconds: number;
  lastCreditAt?: Date;
}

export interface RecordWatchProgressParams {
  lessonId: string;
  courseId: string;
  buckets: number[];
}

export interface CreditWatchBucketsParams {
  userId: unknown;
  lessonId: string;
  courseId: string;
  buckets: number[];
}

export interface WatchableLesson {
  duration?: number;
  video?: string;
}

export interface LeaderboardEntry {
  userId: string;
  /** Rỗng (user đã xoá) thì tên, avatar không thành link trang công khai */
  username: string;
  name: string;
  avatar: string;
  minutes: number;
  rank: number;
  /** Bậc theo tổng giờ học từ trước tới nay, không theo kỳ đang xem. 0 là chưa có bậc */
  tierLevel: number;
}

/** Người đứng ngay trên bạn: đích gần nhất để vượt */
export interface LeaderboardNeighbor {
  name: string;
  rank: number;
  /** Số phút còn thiếu để vượt, làm tròn lên */
  gapMinutes: number;
}

export interface LeaderboardStanding {
  /** 0 là chưa có phút nào trong kỳ, chưa được xếp hạng */
  rank: number;
  minutes: number;
  above?: LeaderboardNeighbor;
}

export interface StudyDayPoint {
  key: string;
  label: string;
  minutes: number;
  isToday: boolean;
}

export interface LeaderboardData {
  entries: LeaderboardEntry[];
  participantCount: number;
  /** null: khách chưa đăng nhập, hoặc admin, expert (không lên bảng) */
  standing: LeaderboardStanding | null;
  studyDays: StudyDayPoint[];
  /** null: cùng điều kiện với standing */
  tierProgress: TierProgress | null;
}

export interface WeekLeaderboardSummary {
  standing: LeaderboardStanding;
  topEntries: LeaderboardEntry[];
}

export interface StudyDayKey {
  key: string;
  label: string;
  isToday: boolean;
}

export interface PeriodSecondsRow {
  _id: unknown;
  seconds: number;
}

/** Một người trong bảng của kỳ, dạng chuỗi để lưu được vào cache */
export interface RankedSecondsRow {
  userId: string;
  seconds: number;
}

/** Cả bảng của một kỳ: mọi người đủ một phút (để tính hạng) và top 100 đã có tên */
export interface PeriodRanking {
  rows: RankedSecondsRow[];
  entries: LeaderboardEntry[];
}

export interface LeaderboardUserRow {
  _id: unknown;
  name?: string;
  username?: string;
  avatar?: string;
}

/** Một bậc học: đủ minSeconds tổng giờ học là lên bậc này */
export interface StudyTier {
  level: number;
  name: string;
  minSeconds: number;
  imageSrc: string;
}

export interface TierProgress {
  /** null: chưa đủ phút để nhận bậc đầu */
  tier: StudyTier | null;
  /** null: đã ở bậc cao nhất */
  nextTier: StudyTier | null;
  totalSeconds: number;
  /** Số giây còn thiếu để lên nextTier; 0 khi đã ở bậc cao nhất */
  remainingSeconds: number;
  /** 0 tới 100, tính trong khoảng từ bậc hiện tại tới bậc kế */
  percent: number;
}

export interface StreakDayPoint {
  key: string;
  label: string;
  isToday: boolean;
  isStudied: boolean;
}

export type StreakStatus = "new" | "risk" | "kept" | "record" | "broken";

export interface StudyStreak {
  /** Số ngày liên tiếp tới hôm nay, hoặc tới hôm qua nếu hôm nay chưa học */
  current: number;
  longest: number;
  isTodayStudied: boolean;
  /** Từng có ít nhất một ngày học */
  hasStudied: boolean;
  recentDays: StreakDayPoint[];
}

export type LeaderboardPreviewState =
  | "du-lieu"
  | "bac-cao-nhat"
  | "chua-co-phut"
  | "khach"
  | "rong"
  | "dang-tai"
  | "loi";

export interface LeaderboardPreviewStateLink {
  state: LeaderboardPreviewState;
  label: string;
}

/** Một người trên bảng giả của trang xem trước */
export interface PreviewLeaderboardPerson {
  name: string;
  avatar: string;
  minutes: number;
  totalHours: number;
}
