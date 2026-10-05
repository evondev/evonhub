import { RatingStatus } from "@/shared/constants/rating.constants";
import { BadgeTone, ModerationScope } from "@/shared/types";

/** Tab trên trang Quản lý đánh giá: ba trạng thái và "Tất cả" */
export type RatingManageTab = RatingStatus | "all";

/** Bộ lọc của trang Quản lý đánh giá, lưu trên URL */
export interface RatingManageFilters {
  search: string;
  tab: RatingManageTab;
  /** Rỗng là mọi khoá */
  courseId: string;
  page: number;
}

export interface RatingManageAuthor {
  name: string;
  avatar?: string;
}

export interface RatingManageCourse {
  slug: string;
  title: string;
}

/** Phần dữ liệu một đánh giá mà danh sách cần */
export interface RatingManageRow {
  id: string;
  content: string;
  /** Số sao 1–5 */
  rating: number;
  status: RatingStatus;
  createdAt: Date | string;
  author: RatingManageAuthor;
  course: RatingManageCourse;
}

/** Số đánh giá của từng tab, đã áp từ khoá và khoá học đang lọc */
export type RatingManageTabCounts = Record<RatingManageTab, number>;

export interface RatingManageResult {
  ratings: RatingManageRow[];
  total: number;
  tabCounts: RatingManageTabCounts;
}

export interface FetchRatingsManageParams {
  status?: RatingStatus;
  courseId?: string;
  page: number;
  limit: number;
  search?: string;
}

/** Đánh giá như fetchRatingsManage trả về, đã populate người viết và khoá */
export interface RatingManageItemData {
  _id: string;
  content?: string;
  rating: number;
  status: RatingStatus;
  createdAt: string;
  user?: { name?: string; avatar?: string } | null;
  course?: { slug?: string; title?: string } | null;
}

export interface FetchRatingsManageResult {
  ratings: RatingManageItemData[];
  total: number;
  tabCounts: RatingManageTabCounts;
}

export interface UpdateRatingsStatusParams {
  ratingIds: string[];
  status: RatingStatus;
}

/** Đổi trạng thái mọi đánh giá khớp bộ lọc đang xem, trừ các đánh giá bỏ tick */
export interface UpdateMatchingRatingsStatusParams {
  scope: ModerationScope;
  /** Trạng thái của tab đang xem; tab "Tất cả" thì để trống */
  currentStatus?: RatingStatus;
  excludedIds: string[];
  status: RatingStatus;
}

export interface RatingStatusBadge {
  tone: BadgeTone;
  label: string;
}

/** Mức cảm xúc ứng với số sao: icon và nhãn */
export interface RatingReaction {
  icon: string;
  label: string;
}

export type RatingManagePreviewState =
  "du-lieu" | "het-cho" | "rong" | "dang-tai" | "loi";

export interface RatingManagePreviewStateLink {
  state: RatingManagePreviewState;
  label: string;
}
