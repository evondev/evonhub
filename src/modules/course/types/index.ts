import {
  CourseLabel,
  CourseLevel,
  CourseStatus,
  CourseType,
} from "@/shared/constants/course.constants";
import { LectureItemData } from "@/shared/types";
import type { LucideIcon } from "lucide-react";
import { ECourseLevel, ECourseStatus } from "@/types/enums";
import {
  createVideoSchema,
  updateCourseSchema,
  updateVideoSchema,
} from "@/utils/formSchema";
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
  /** Lượt học; aggregate, lean trên bản ghi cũ không có field này */
  studyCount?: number;
  cta: string;
  ctaLink: string;
  createdAt: Date;
  seoKeywords: string;
  minPrice?: number;
  free: boolean;
  isPackage: boolean;
  _destroy: boolean;
  isMicro?: boolean;
  type?: CourseType;
  /** Video lẻ chưa có nội dung; bản ghi cũ không có field này */
  isComingSoon?: boolean;
}

export interface CourseItemData extends Omit<
  CourseModelProps,
  "id" | "lecture"
> {
  _id: string;
  lecture: LectureItemData[];
  studentCount?: number;
}

/** Số liệu gộp của các khóa đang bán, dùng ở hero dashboard và landing */
export interface CatalogStats {
  courseCount: number;
  /** Số khóa miễn phí (free và giá 0) trong danh sách */
  freeCourseCount: number;
  totalViews: number;
  /** Tổng lượt vào học: mỗi người tối đa một lượt mỗi ngày mỗi khóa */
  totalStudyCount: number;
  averageRating: number;
  ratingCount: number;
}

export interface FetchCoursesManageProps {
  search?: string;
  limit: number;
  page: number;
  isFree?: boolean;
  /** Chỉ lấy video lẻ */
  isVideo?: boolean;
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
  studyCount: number;
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
export interface CourseUpdateData extends Pick<
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

export interface CreateVideoProps {
  title: string;
  slug: string;
}

export interface CreateVideoResponse {
  type: "success" | "error";
  message: string;
}

/** Bài học duy nhất của video lẻ: chứa video và nội dung đi kèm */
export interface VideoLessonData {
  _id: string;
  video: string;
  assetId: string;
  iframe: string;
  content: string;
  duration: number;
}

/** Dữ liệu trang sửa video lẻ: thông tin bán của course và bài học của nó */
export interface VideoUpdateData extends Pick<
  CourseUpdateData,
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
  | "level"
  | "status"
  | "category"
> {
  isComingSoon?: boolean;
  lesson: VideoLessonData;
}

/** Bài của video lẻ ở trang xem: chưa có quyền xem thì không có video, nội dung */
export interface VideoDetailsLesson {
  _id: string;
  duration: number;
  video?: string;
  iframe?: string;
  content?: string;
}

/** Dữ liệu trang xem video lẻ */
export interface VideoDetailsData extends Pick<
  CourseModelProps,
  | "title"
  | "slug"
  | "desc"
  | "intro"
  | "image"
  | "price"
  | "salePrice"
  | "free"
  | "cta"
  | "level"
  | "status"
  | "seoKeywords"
> {
  _id: string;
  lesson: VideoDetailsLesson;
  isFree: boolean;
  /** Đã lên danh sách nhưng chưa có nội dung: không xem, không mua được */
  isComingSoon: boolean;
  /** Video miễn phí, đã mua, hoặc người quản lý */
  canWatch: boolean;
}

/** Một thẻ ở trang danh sách video: thông tin bán của course, thời lượng của bài */
export interface VideoListItem extends Pick<
  CourseModelProps,
  | "title"
  | "slug"
  | "image"
  | "level"
  | "rating"
  | "price"
  | "salePrice"
  | "free"
  | "isComingSoon"
  | "createdAt"
  | "studyCount"
> {
  _id: string;
  duration: number;
  /** Mô tả dạng chữ thường đã cắt ngắn, cho dạng danh sách; rỗng là chưa có mô tả */
  excerpt: string;
}

/** Một dòng của truy vấn danh sách video, kèm link YouTube của bài để lấy thumbnail */
export interface VideoListRow extends Omit<VideoListItem, "excerpt"> {
  iframe?: string;
  /** Mô tả HTML soạn trong admin */
  desc?: string;
}

/** Cách xếp video ở trang danh sách: lưới thẻ, hoặc mỗi video một hàng ngang */
export type VideoListView = "grid" | "list";

export interface VideoListViewOption {
  view: VideoListView;
  label: string;
  icon: LucideIcon;
}

/** Video giả của trang xem trước, mang slug danh mục để lọc như server */
export interface PreviewVideoListItem extends VideoListItem {
  categorySlug: string;
}

/** Chip danh mục ở trang danh sách video */
export interface VideoCategoryOption {
  name: string;
  slug: string;
}

/** Bộ lọc trang danh sách video, lưu trên URL */
export interface VideoListFilters {
  search: string;
  isFree: boolean;
  /** Rỗng là mọi danh mục */
  categorySlug: string;
}

export interface VideoListSearchParams {
  q?: string;
  gia?: string;
  danhmuc?: string;
  /** "danh-sach" là xếp hàng ngang, không có là lưới */
  xem?: string;
}

export interface FetchVideosParams extends VideoListFilters {
  limit: number;
}

export type VideoListPreviewState =
  "du-lieu" | "khong-ket-qua" | "chua-co-video" | "dang-tai" | "loi";

export interface VideoListPreviewStateLink {
  state: VideoListPreviewState;
  label: string;
}

export type VideoUpdateFormValues = z.infer<typeof updateVideoSchema>;

export type VideoCreateFormValues = z.infer<typeof createVideoSchema>;

/** Một người đã được tính lượt học của một khóa trong một ngày */
export interface StudySessionModelProps extends Document {
  user: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  /** Ngày theo giờ Việt Nam, dạng YYYY-MM-DD */
  day: string;
  createdAt: Date;
}
