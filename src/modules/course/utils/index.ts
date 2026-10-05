import { COURSE_LEVEL_LABELS } from "@/shared/constants/course.constants";
import { formatCompactCount } from "@/shared/helpers";
import dayjs from "dayjs";
import {
  EXPLORE_DEFAULT_FILTERS,
  EXPLORE_LEVEL_OPTIONS,
  EXPLORE_PAGE_SIZE,
  EXPLORE_SORT_OPTIONS,
  PREVIEW_EXPLORE_COURSES,
} from "../constants";
import type { LessonDetailsOutlineData } from "@/shared/types";
import type {
  CourseCurriculumStats,
  CourseItemData,
  ExploreCoursesResult,
  ExploreFilters,
  ExploreLinkBase,
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

  return `-${100 - Math.floor((price / salePrice) * 100)}%`;
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
  const levelOption = EXPLORE_LEVEL_OPTIONS.find(
    (option) => option.slug === searchParams.trinhdo,
  );
  const page = Number.parseInt(searchParams.trang || "", 10);

  return {
    search: (searchParams.q || "").trim(),
    isFree: searchParams.gia === "mien-phi",
    level: levelOption?.level,
    sort: sortOption?.value || EXPLORE_DEFAULT_FILTERS.sort,
    page: Number.isFinite(page) && page > 1 ? page : 1,
  };
}

export function hasActiveExploreFilters(filters: ExploreFilters): boolean {
  return filters.isFree || Boolean(filters.level) || Boolean(filters.search);
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

  const levelOption = EXPLORE_LEVEL_OPTIONS.find(
    (option) => option.level === filters.level,
  );

  if (levelOption) params.set("trinhdo", levelOption.slug);
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
    .filter((course) => !filters.level || course.level === filters.level)
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

/** 161 → "2 giờ 41 phút", 45 → "45 phút", 120 → "2 giờ" */
export function formatDurationMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${minutes} phút`;
  if (remainingMinutes === 0) return `${hours} giờ`;

  return `${hours} giờ ${remainingMinutes} phút`;
}

/** Tổng phút của các bài; bài chưa có thời lượng tính 0 */
export function sumLessonMinutes(lessons: { duration?: number }[]): number {
  return lessons.reduce(
    (total, lesson) => total + (Number(lesson.duration) || 0),
    0,
  );
}

export function getCurriculumStats(
  lectures: LessonDetailsOutlineData[],
): CourseCurriculumStats {
  const lessons = lectures.flatMap((lecture) => lecture.lessons);

  return {
    chapterCount: lectures.length,
    lessonCount: lessons.length,
    totalMinutes: sumLessonMinutes(lessons),
    trialCount: lessons.filter((lesson) => lesson.trial).length,
  };
}

/** Link YouTube dạng `watch?v=` hoặc `youtu.be/` → id để nhúng */
export function getYoutubeEmbedId(intro: string): string {
  if (intro.includes("v=")) return intro.split("v=")[1]?.split("&")[0] || "";

  return intro.split("/").at(-1) || "";
}

export function getLessonPreviewHref(courseSlug: string, lessonId: string) {
  return `/${courseSlug}/lesson?id=${lessonId}&isPreview=true`;
}

/** Giá trị của chương trong accordion "Nội dung khóa học" */
export function getChapterValue(index: number): string {
  return `chuong-${index}`;
}

/** "12 bài · 2 giờ 41 phút · 1 học thử" */
export function formatChapterSummary(
  lessons: { duration?: number; trial?: boolean }[],
): string {
  const trialCount = lessons.filter((lesson) => lesson.trial).length;
  const summaryParts = [
    `${lessons.length} bài`,
    formatDurationMinutes(sumLessonMinutes(lessons)),
  ];

  if (trialCount > 0) summaryParts.push(`${trialCount} học thử`);

  return summaryParts.join(" · ");
}

/** Giá trị accordion của các chương có ít nhất một bài học thử */
export function getTrialChapterValues(
  lectures: LessonDetailsOutlineData[],
): string[] {
  return lectures.flatMap((lecture, index) =>
    lecture.lessons.some((lesson) => lesson.trial)
      ? [getChapterValue(index)]
      : [],
  );
}

/** "02/09/2026": ngày tháng luôn hai chữ số để cột ngày thẳng hàng */
export function formatShortDate(date: Date | string): string {
  return dayjs(date).format("DD/MM/YYYY");
}

/** % giảm của giá bán so với giá gốc, null khi không có giá gốc cao hơn */
export function getCourseDiscountPercent(
  price: number,
  salePrice: number,
): number | null {
  if (!salePrice || price >= salePrice) return null;

  return Math.round(((salePrice - price) / salePrice) * 100);
}
