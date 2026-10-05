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

export interface PartnerLink {
  name: string;
  url: string;
}

/**
 * Một bước của lộ trình. Có khóa public trùng slug thì bước dẫn tới khóa đó;
 * chưa có mà có launchLabel thì hiện là bước sắp ra mắt.
 */
export interface RoadmapStepConfig {
  slug: string;
  shortTitle: string;
  outcome: string;
  icon: LucideIcon;
  /** Ví dụ "11/2026". Bỏ trống thì bước chỉ hiện khi khóa đã public */
  launchLabel?: string;
}

export interface RoadmapStep extends RoadmapStepConfig {
  stepNumber: number;
  /** Không có là khóa chưa public, bước đang chờ ra mắt */
  course?: CourseItemData;
  /** Chỉ có khi học viên đã sở hữu khóa này */
  courseProgress?: DashboardCourseProgress;
}

export interface CatalogStats {
  courseCount: number;
  totalViews: number;
  averageRating: number;
  ratingCount: number;
}

export interface HeroStatItem {
  value: string;
  label: string;
}

export interface HeroCodeLine {
  code: string;
  isFlagged?: boolean;
}

export interface PreviewCourseSeed {
  slug: string;
  title: string;
  desc: string;
  image: string;
  price: number;
  salePrice: number;
  free: boolean;
  rating: number[];
  views: number;
}

export interface PreviewCourseProgress {
  slug: string;
  current: number;
  total: number;
}

export type DashboardPreviewState =
  "hoc-vien" | "nguoi-moi" | "khach" | "chua-co-khoa" | "dang-tai" | "loi";

export interface PreviewStateLink {
  state: DashboardPreviewState;
  label: string;
}
