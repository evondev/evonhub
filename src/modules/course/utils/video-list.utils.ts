import type {
  ExploreLinkBase,
  VideoListFilters,
  VideoListItem,
  VideoListPreviewState,
  VideoListSearchParams,
} from "../types";
import {
  PREVIEW_VIDEO_LIST,
  PREVIEW_VIDEO_LIST_EMPTY_KEYWORD,
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
