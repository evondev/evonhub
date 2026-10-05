import { COURSE_LEVEL_LABELS } from "@/shared/constants/course.constants";
import { formatCompactCount } from "@/shared/helpers";
import {
  EXPLORE_DEFAULT_FILTERS,
  EXPLORE_PAGE_SIZE,
  EXPLORE_SORT_OPTIONS,
  PREVIEW_EXPLORE_COURSES,
} from "../constants";
import type {
  CourseItemData,
  ExploreCoursesResult,
  ExploreFilters,
  ExploreLinkBase,
  ExplorePaginationItem,
  ExplorePreviewState,
  ExploreSearchParams,
} from "../types";

/**
 * Kiểm tra user đã sở hữu khóa học hay chưa.
 * `courses` có thể là mảng ObjectId hoặc mảng document đã populate.
 */
export function isCourseOwned(
  courses: unknown[] | undefined,
  courseId: string,
): boolean {
  if (!courses?.length) return false;

  return courses
    .filter(Boolean)
    .map((course) => {
      const populatedCourse = course as { _id?: unknown };

      return String(populatedCourse?._id ?? course);
    })
    .includes(courseId);
}

interface CourseFreeCheck {
  price?: number;
  free?: boolean;
}

/**
 * Khóa chỉ được coi là miễn phí khi vừa bật cờ `free` vừa có giá 0.
 * Giữ đúng một định nghĩa cho cả UI lẫn server để cờ `free` bật nhầm trên khóa
 * có giá không biến nó thành khóa cho không.
 */
export function isCourseFree({ price, free }: CourseFreeCheck): boolean {
  return !!free && (price ?? 0) <= 0;
}

interface DiscountLabelProps {
  isFree: boolean;
  price: number;
  salePrice: number;
}

/**
 * Nhãn phần trăm giảm giá. Trả về chuỗi rỗng khi không có giá gốc để so sánh,
 * tránh chia cho 0 ra `-Infinity %`.
 */
export function getDiscountLabel({
  isFree,
  price,
  salePrice,
}: DiscountLabelProps): string {
  if (salePrice <= 0) return "";

  if (isFree) return "-100%";

  return `-${100 - Math.floor((price / salePrice) * 100)} %`;
}

export function getAverageRating(ratings: number[] = []): number {
  if (ratings.length === 0) return 0;

  const ratingTotal = ratings.reduce((total, rating) => total + rating, 0);

  return ratingTotal / ratings.length;
}

/** 4.666 → "4,7" */
export function formatRating(rating: number): string {
  return rating.toFixed(1).replace(".", ",");
}

/** Thoát ký tự đặc biệt để chuỗi người dùng gõ dùng an toàn trong RegExp */
export function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Đọc bộ lọc từ URL; giá trị lạ thì về mặc định */
export function parseExploreFilters(
  searchParams: ExploreSearchParams,
): ExploreFilters {
  const sortOption = EXPLORE_SORT_OPTIONS.find(
    (option) => option.value === searchParams.sapxep,
  );
  const page = Number.parseInt(searchParams.trang || "", 10);

  return {
    search: (searchParams.q || "").trim(),
    isFree: searchParams.gia === "mien-phi",
    sort: sortOption?.value || EXPLORE_DEFAULT_FILTERS.sort,
    page: Number.isFinite(page) && page > 1 ? page : 1,
  };
}

export function hasActiveExploreFilters(filters: ExploreFilters): boolean {
  return filters.isFree || Boolean(filters.search);
}

/**
 * Link tới trang Khóa học với bộ lọc cho trước. Giá trị mặc định không ghi lên
 * URL cho gọn.
 */
export function buildExploreHref(
  { basePath, fixedParams = {} }: ExploreLinkBase,
  filters: ExploreFilters,
): string {
  const params = new URLSearchParams(fixedParams);

  if (filters.search) params.set("q", filters.search);
  if (filters.isFree) params.set("gia", "mien-phi");
  if (filters.sort !== EXPLORE_DEFAULT_FILTERS.sort) {
    params.set("sapxep", filters.sort);
  }
  if (filters.page > 1) params.set("trang", String(filters.page));

  const queryString = params.toString();

  return queryString ? `${basePath}?${queryString}` : basePath;
}

export function getExploreTotalPages(total: number): number {
  return Math.ceil(total / EXPLORE_PAGE_SIZE);
}

/**
 * Các ô phân trang: luôn có trang đầu, trang cuối và hai bên trang hiện tại,
 * chỗ hụt thì là "…". Hụt đúng một trang thì ghi số luôn thay vì "…".
 */
export function buildPaginationItems(
  currentPage: number,
  totalPages: number,
): ExplorePaginationItem[] {
  const visiblePages = new Set(
    [1, totalPages, currentPage - 1, currentPage, currentPage + 1].filter(
      (page) => page >= 1 && page <= totalPages,
    ),
  );
  const sortedPages = Array.from(visiblePages).sort(
    (first, second) => first - second,
  );
  const paginationItems: ExplorePaginationItem[] = [];

  sortedPages.forEach((page, index) => {
    const previousPage = sortedPages[index - 1];

    if (previousPage && page - previousPage === 2) {
      paginationItems.push(previousPage + 1);
    }

    if (previousPage && page - previousPage > 2) {
      paginationItems.push("ellipsis");
    }

    paginationItems.push(page);
  });

  return paginationItems;
}

/** "Cơ bản · 12 nghìn lượt xem"; khóa chưa ai xem thì ghi "Khóa mới" */
export function formatCourseMeta({
  level,
  views,
}: Pick<CourseItemData, "level" | "views">): string {
  const viewsLabel = views
    ? `${formatCompactCount(views)} lượt xem`
    : "Khóa mới";

  return [COURSE_LEVEL_LABELS[level], viewsLabel].filter(Boolean).join(" · ");
}

/**
 * Khóa giả cho trang xem trước ở dev. Ép kiểu vì CourseItemData kế thừa
 * Document của Mongoose; trang xem trước chỉ đọc các trường hiển thị.
 */
function buildPreviewExploreCourses(): CourseItemData[] {
  return PREVIEW_EXPLORE_COURSES.map(
    (seed) =>
      ({
        ...seed,
        _id: seed.slug,
        lecture: [],
      }) as unknown as CourseItemData,
  );
}

/** Lọc, sắp xếp, chia trang khóa giả như server làm, theo trạng thái xem trước */
export function buildPreviewExploreResult(
  state: ExplorePreviewState,
  filters: ExploreFilters,
): ExploreCoursesResult {
  const allCourses = buildPreviewExploreCourses();

  if (state === "chua-co-khoa" || state === "khong-ket-qua") {
    return { courses: [], total: 0 };
  }

  if (state === "mot-khoa")
    return { courses: allCourses.slice(4, 5), total: 1 };

  const keyword = filters.search.toLowerCase();
  const filteredCourses = allCourses
    .filter((course) => !filters.isFree || isCourseFree(course))
    .filter((course) => course.title.toLowerCase().includes(keyword));
  const sortedCourses = [...filteredCourses].sort((first, second) => {
    if (filters.sort === "xem-nhieu") return second.views - first.views;
    if (filters.sort === "danh-gia") {
      return getAverageRating(second.rating) - getAverageRating(first.rating);
    }

    return 0;
  });
  const startIndex = (filters.page - 1) * EXPLORE_PAGE_SIZE;

  return {
    courses: sortedCourses.slice(startIndex, startIndex + EXPLORE_PAGE_SIZE),
    total: sortedCourses.length,
  };
}
