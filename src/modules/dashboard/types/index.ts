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
}

export interface PartnerLink {
  name: string;
  url: string;
}

export interface PreviewCourseProgress {
  current: number;
  total: number;
}

export type DashboardPreviewState =
  "hoc-vien" | "chua-noi" | "nguoi-moi" | "khach" | "dang-tai" | "loi";

export interface PreviewStateLink {
  state: DashboardPreviewState;
  label: string;
}
