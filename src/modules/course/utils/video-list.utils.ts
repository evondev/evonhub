import { COURSE_LEVEL_LABELS } from "@/shared/constants/course.constants";
import { htmlToPlainText } from "@/shared/helpers";
import { timeAgo } from "@/shared/utils";
import type {
  ExploreLinkBase,
  VideoListFilters,
  VideoListItem,
  VideoListPreviewState,
  VideoListSearchParams,
  VideoListView,
} from "../types";
import {
  PREVIEW_VIDEO_LIST,
  PREVIEW_VIDEO_LIST_EMPTY_KEYWORD,
  VIDEO_EXCERPT_MAX_LENGTH,
  VIDEO_LIST_LIST_VIEW_VALUE,
  VIDEO_LIST_VIEW_PARAM,
} from "../constants/video-list.constants";
import { isCourseFree } from "./index";

/** Cùng tên tham số với trang Khóa học: ?q= từ khoá, ?gia=mien-phi; thêm ?danhmuc=<slug> */
export function parseVideoListFilters(
  searchParams: VideoListSearchParams,
): VideoListFilters {
  return {
    search: (searchParams.q || "").trim(),
    isFree: searchParams.gia === "mien-phi",
    categorySlug: (searchParams.danhmuc || "").trim(),
  };
}

/** Kiểu xếp không phải bộ lọc: đổi kiểu không tải lại khung chờ, xoá lọc vẫn giữ kiểu */
export function parseVideoListView(
  searchParams: VideoListSearchParams,
): VideoListView {
  return searchParams.xem === VIDEO_LIST_LIST_VIEW_VALUE ? "list" : "grid";
}

/**
 * Gắn kiểu xếp vào fixedParams của linkBase: mọi link lọc dựng từ linkBase (chip,
 * xoá lọc) giữ nguyên kiểu đang xem. Lưới là mặc định nên không ghi lên URL
 */
export function withVideoListView(
  linkBase: ExploreLinkBase,
  view: VideoListView,
): ExploreLinkBase {
  const otherParams = { ...linkBase.fixedParams };

  delete otherParams[VIDEO_LIST_VIEW_PARAM];

  if (view === "grid") return { ...linkBase, fixedParams: otherParams };

  return {
    ...linkBase,
    fixedParams: {
      ...otherParams,
      [VIDEO_LIST_VIEW_PARAM]: VIDEO_LIST_LIST_VIEW_VALUE,
    },
  };
}

export function buildVideoListHref(
  { basePath, fixedParams = {} }: ExploreLinkBase,
  filters: VideoListFilters,
): string {
  const params = new URLSearchParams(fixedParams);

  if (filters.search) params.set("q", filters.search);
  if (filters.isFree) params.set("gia", "mien-phi");
  if (filters.categorySlug) params.set("danhmuc", filters.categorySlug);

  const queryString = params.toString();

  return queryString ? `${basePath}?${queryString}` : basePath;
}

export function hasActiveVideoListFilters(filters: VideoListFilters): boolean {
  return (
    filters.isFree || Boolean(filters.search) || Boolean(filters.categorySlug)
  );
}

/** "Cơ bản · 3 ngày trước", dòng phụ dưới tên video ở cả thẻ lưới lẫn hàng ngang */
export function formatVideoMeta(video: VideoListItem): string {
  return [COURSE_LEVEL_LABELS[video.level], timeAgo(video.createdAt)]
    .filter(Boolean)
    .join(" · ");
}

/** Mô tả HTML thành chữ thường, cắt ở khoảng trắng gần giới hạn nhất */
export function toVideoExcerpt(descHtml: string): string {
  const plainText = htmlToPlainText(descHtml);

  if (plainText.length <= VIDEO_EXCERPT_MAX_LENGTH) return plainText;

  const cutText = plainText.slice(0, VIDEO_EXCERPT_MAX_LENGTH);
  const lastSpaceIndex = cutText.lastIndexOf(" ");

  return `${cutText.slice(0, lastSpaceIndex > 0 ? lastSpaceIndex : undefined)}…`;
}

/** Danh sách giả của trang xem trước, lọc giống cách server lọc */
export function buildPreviewVideoList(
  state: VideoListPreviewState,
  filters: VideoListFilters,
): VideoListItem[] {
  if (state === "chua-co-video" || state === "khong-ket-qua") return [];

  const keyword = filters.search.toLowerCase();

  return PREVIEW_VIDEO_LIST.filter((video) => {
    if (keyword && !video.title.toLowerCase().includes(keyword)) return false;
    if (filters.isFree && !isCourseFree(video)) return false;
    if (filters.categorySlug && video.categorySlug !== filters.categorySlug) {
      return false;
    }

    return true;
  });
}

/** Trạng thái "không có kết quả" cần một từ khoá để khác trạng thái "chưa có video" */
export function getPreviewVideoListFilters(
  state: VideoListPreviewState,
  filters: VideoListFilters,
): VideoListFilters {
  if (state !== "khong-ket-qua" || filters.search) return filters;

  return { ...filters, search: PREVIEW_VIDEO_LIST_EMPTY_KEYWORD };
}
