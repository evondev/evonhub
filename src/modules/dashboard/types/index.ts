import { CourseItemData } from "@/modules/course/types";
import { LucideIcon } from "lucide-react";

export interface DashboardLessonLink {
  _id: string;
  slug: string;
}

export interface DashboardCourseProgress {
  course: CourseItemData;
  lesson: DashboardLessonLink;
  progress: number;
  current: number;
  total: number;
}

export interface WeeklyLessonCount {
  /** Nhãn trục, ví dụ "21/09". Tuần đang chạy thì truyền isCurrent */
  label: string;
  value: number;
  isCurrent?: boolean;
}

/** Số liệu học theo thời gian, tính từ lịch sử học (History.createdAt) */
export interface LearningActivity {
  lessonsLastSevenDays: number;
  lessonsToday: number;
  currentStreakDays: number;
  longestStreakDays: number;
  weeklyLessons: WeeklyLessonCount[];
}

export interface LearningStatTile {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  /** Sắc nhạt riêng cho ô icon, mỗi ô một sắc phân loại */
  iconClassName: string;
}

export interface PartnerLink {
  name: string;
  url: string;
}

/** Một bước của lộ trình: khóa nào, gọi ngắn là gì, học xong làm được gì */
export interface RoadmapStepConfig {
  slug: string;
  shortTitle: string;
  outcome: string;
}

export interface RoadmapStep extends RoadmapStepConfig {
  stepNumber: number;
  course: CourseItemData;
  /** Chỉ có khi học viên đã sở hữu khóa này */
  courseProgress?: DashboardCourseProgress;
}

export interface CatalogStats {
  courseCount: number;
  totalViews: number;
  averageRating: number;
  ratingCount: number;
}

export interface PreviewCourseProgress {
  slug: string;
  current: number;
  total: number;
}

export type DashboardPreviewState =
  "hoc-vien" | "chua-noi" | "nguoi-moi" | "khach" | "dang-tai" | "loi";

export interface PreviewStateLink {
  state: DashboardPreviewState;
  label: string;
}
