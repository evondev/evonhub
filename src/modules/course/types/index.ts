import {
  CourseLabel,
  CourseLevel,
  CourseStatus,
} from "@/shared/constants/course.constants";
import { LectureItemData } from "@/shared/types";
import mongoose, { Document, Schema } from "mongoose";

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
  sort: ExploreSort;
  page: number;
}

export interface ExploreSearchParams {
  q?: string;
  gia?: string;
  sapxep?: string;
  trang?: string;
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

/** Một ô trên thanh phân trang: số trang hoặc dấu "…" */
export type ExplorePaginationItem = number | "ellipsis";

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
