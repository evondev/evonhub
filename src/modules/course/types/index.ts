import {
  CourseLabel,
  CourseLevel,
  CourseStatus,
} from "@/shared/constants/course.constants";
import { LectureItemData } from "@/shared/types";
import type { LucideIcon } from "lucide-react";
import { ECourseLevel, ECourseStatus } from "@/types/enums";
import { updateCourseSchema } from "@/utils/formSchema";
import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

mongoose.Promise = global.Promise;

export interface CourseModelProps extends Document {
  id: string;
  title: string;
  slug: string;
  price: number;
  salePrice: number;
  desc: string;
  content: string;
  rating: number[];
  image: string;
  intro: string;
  status: CourseStatus;
  level: CourseLevel;
  category: Schema.Types.ObjectId;
  label: CourseLabel;
  info: {
    requirements: string[];
    gained: string[];
    qa: {
      question: string;
      answer: string;
    }[];
  };
  review: Schema.Types.ObjectId[];
  lecture: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  views: number;
  cta: string;
  ctaLink: string;
  createdAt: Date;
  seoKeywords: string;
  minPrice?: number;
  free: boolean;
  isPackage: boolean;
  _destroy: boolean;
  isMicro?: boolean;
}

export interface CourseItemData extends Omit<
  CourseModelProps,
  "id" | "lecture"
> {
  _id: string;
  lecture: LectureItemData[];
  studentCount?: number;
}

export interface FetchCoursesManageProps {
  search?: string;
  limit: number;
  page: number;
  isFree?: boolean;
  status?: CourseStatus;
  /** Lọc theo nhiều trạng thái cùng lúc, ưu tiên hơn `status` */
  statuses?: CourseStatus[];
  isAll?: boolean;
  shouldFilterEnrolled?: boolean;
}

export interface FetchCoursesParams extends Partial<FetchCoursesManageProps> {}

export interface EnrollCourseProps {
  courseId: string;
  couponCode?: string;
}

export interface EnrollFreeProps {
  slug: string;
}

export interface EnrollOrderResult {
  code: string;
}

export interface EnrollResponse {
  order?: EnrollOrderResult;
  error?: string;
}

export interface EnrollFreeResponse {
  type: "success" | "error";
  message: string;
}

export type ExploreSort = "moi" | "xem-nhieu" | "danh-gia";

export interface ExploreSortOption {
  value: ExploreSort;
  label: string;
}

/** Bộ lọc trang Khóa học, đọc từ URL: ?q=&gia=mien-phi&sapxep=&trang= */
export interface ExploreFilters {
  search: string;
  isFree: boolean;
  /** Không có là mọi trình độ */
  level?: CourseLevel;
  sort: ExploreSort;
  page: number;
}

export interface ExploreSearchParams {
  q?: string;
  gia?: string;
  trinhdo?: string;
  sapxep?: string;
  trang?: string;
}

/** Chip trình độ: slug tiếng Việt trên URL (?trinhdo=co-ban) ứng với level trong DB */
export interface ExploreLevelOption {
  slug: string;
  level: CourseLevel;
}

/** Gốc để dựng link lọc: trang thật là /explore, trang xem trước giữ thêm ?tt= */
export interface ExploreLinkBase {
  basePath: string;
  fixedParams?: Record<string, string>;
}

export interface FetchExploreCoursesParams extends ExploreFilters {
  limit: number;
}

export interface ExploreCoursesResult {
  courses: CourseItemData[];
  /** Tổng số khóa khớp bộ lọc, chưa chia trang */
  total: number;
}

/** Kết quả $facet của truy vấn trang Khóa học */
export interface ExploreFacetResult {
  courses: CourseItemData[];
  total: { value: number }[];
}

export type ExplorePreviewState =
  | "du-lieu"
  | "mot-khoa"
  | "khong-ket-qua"
  | "chua-co-khoa"
  | "dang-tai"
  | "loi";

export interface ExplorePreviewStateLink {
  state: ExplorePreviewState;
  label: string;
}

export interface PreviewExploreCourseSeed {
  slug: string;
  title: string;
  image: string;
  level: CourseLevel;
  price: number;
  salePrice: number;
  free: boolean;
  rating: number[];
  views: number;
}

export interface CourseCurriculumStats {
  chapterCount: number;
  lessonCount: number;
  totalMinutes: number;
  trialCount: number;
}

export interface CourseIncludeItem {
  icon: LucideIcon;
  label: string;
}

export interface CourseQaItem {
  question: string;
  answer: string;
}

export interface CoursePurchase {
  /** Số tiền giảm từ mã `?appliedCoupon=` trên URL, 0 khi không có mã */
  discount: number;
  isBuying: boolean;
  isEnrollingFree: boolean;
  handleBuyCourse: () => void;
  handleEnrollFree: () => void;
}

export type CourseUpdateFormValues = z.infer<typeof updateCourseSchema>;

export type CourseInfoListKey = "requirements" | "gained";

/** Yêu cầu, kết quả, Q/A: sửa ngoài react-hook-form, gộp vào lúc gửi */
export interface CourseInfoDraft {
  requirements: string[];
  gained: string[];
  qa: CourseQaItem[];
}

export interface CourseSelectOption {
  value: string;
  label: string;
}

/** Dữ liệu trang cập nhật khóa học cần, không phải cả document Mongoose */
export interface CourseUpdateData
  extends Pick<
    CourseModelProps,
    | "title"
    | "slug"
    | "price"
    | "salePrice"
    | "intro"
    | "desc"
    | "image"
    | "cta"
    | "seoKeywords"
    | "free"
    | "info"
  > {
  // Enum của form (updateCourseSchema), cùng giá trị chuỗi với CourseLevel, CourseStatus
  level: ECourseLevel;
  status: ECourseStatus;
  category?: CourseModelProps["category"];
}

export type CourseUpdatePreviewState = "du-lieu" | "rong";
