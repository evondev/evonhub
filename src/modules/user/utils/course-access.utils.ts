import { CourseStatus } from "@/shared/constants/course.constants";
import { UserStatus } from "@/shared/constants/user.constants";
import { formatThoundsand } from "@/shared/utils";
import {
  COURSE_ACCESS_QUERY_PREVIEW_LENGTH,
  COURSE_ACCESS_SOURCE_LABELS,
  PREVIEW_COURSE_ACCESS_CATALOG,
} from "../constants/course-access.constants";
import {
  CourseAccessCourse,
  CourseAccessCourseSource,
  CourseAccessGrant,
  CourseAccessPreviewState,
  CourseAccessUser,
  CourseAccessUserSource,
} from "../types/course-access.types";

export function toCourseAccessCourse(
  course: CourseAccessCourseSource,
): CourseAccessCourse {
  return {
    id: course._id.toString(),
    slug: course.slug,
    title: course.title,
    image: course.image || undefined,
    price: course.price || 0,
    isFree: Boolean(course.free),
    isRetired: course.status === CourseStatus.Rejected,
  };
}

export function toCourseAccessUser(
  user: CourseAccessUserSource,
): CourseAccessUser {
  return {
    clerkId: user.clerkId,
    name: user.name || user.username,
    username: user.username,
    email: user.email,
    avatar: user.avatar || undefined,
    role: user.role,
    createdAt: user.createdAt,
    isLocked: user.status === UserStatus.Inactive,
  };
}

/** Bỏ dấu, chữ thường: gõ "lap trinh" vẫn ra "Lập trình" */
export function normalizeSearchText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

export function filterCourseOptions(
  courses: CourseAccessCourse[],
  query: string,
): CourseAccessCourse[] {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) return courses;

  return courses.filter((course) =>
    normalizeSearchText(course.title).includes(normalizedQuery),
  );
}

/** Khóa chưa có lên trước, khóa đã có xuống cuối; trong mỗi nhóm giữ thứ tự danh mục */
export function sortCourseOptions(
  courses: CourseAccessCourse[],
  ownedCourseIds: Set<string>,
): CourseAccessCourse[] {
  const availableCourses = courses.filter(
    (course) => !ownedCourseIds.has(course.id),
  );
  const ownedCourses = courses.filter((course) =>
    ownedCourseIds.has(course.id),
  );

  return [...availableCourses, ...ownedCourses];
}

export function formatCourseAccessDate(date: string): string {
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Ho_Chi_Minh",
  });
}

export function formatCourseAccessPrice(course: CourseAccessCourse): string {
  if (course.isFree || course.price === 0) return "Miễn phí";

  return `${formatThoundsand(course.price)} đ`;
}

/** "Cấp tay · 20/09/2026"; thiếu cả nguồn lẫn ngày thì không có dòng này */
export function buildGrantMeta(grant: CourseAccessGrant): string | undefined {
  const metaParts: string[] = [];

  if (grant.source) metaParts.push(COURSE_ACCESS_SOURCE_LABELS[grant.source]);
  if (grant.grantedAt)
    metaParts.push(formatCourseAccessDate(grant.grantedAt));

  if (metaParts.length === 0) return undefined;

  return metaParts.join(" · ");
}

/** Ngoặc kép dính liền từ khoá, từ khoá dài cắt bằng số ký tự */
export function quoteSearchQuery(query: string): string {
  const trimmedQuery = query.trim();
  const isLongQuery = trimmedQuery.length > COURSE_ACCESS_QUERY_PREVIEW_LENGTH;
  const visibleQuery = isLongQuery
    ? `${trimmedQuery.slice(0, COURSE_ACCESS_QUERY_PREVIEW_LENGTH)}…`
    : trimmedQuery;

  return `“${visibleQuery}”`;
}

export function buildGrantSubmitLabel(selectedCount: number): string {
  if (selectedCount <= 1) return "Cấp khóa học";

  return `Cấp ${selectedCount} khóa học`;
}

/** Khóa thành viên giả đang có: đủ ca đã mua, cấp tay, ngừng bán, thiếu ảnh, thiếu ngày */
export function buildPreviewGrants(
  state: CourseAccessPreviewState,
): CourseAccessGrant[] {
  if (state === "rong") return [];

  const findCourse = (courseId: string) =>
    PREVIEW_COURSE_ACCESS_CATALOG.find((course) => course.id === courseId)!;

  return [
    {
      course: findCourse("preview-typescript-co-ban"),
      source: "manual",
      grantedAt: "2026-09-20T03:15:00.000Z",
    },
    {
      course: findCourse("preview-nextjs-pro"),
      source: "purchase",
      grantedAt: "2025-03-12T10:42:00.000Z",
    },
    {
      course: findCourse("preview-bao-mat-web"),
      source: "manual",
      grantedAt: "2025-01-06T07:00:00.000Z",
    },
    {
      course: findCourse("preview-javascript-2023"),
      source: "purchase",
      grantedAt: "2024-02-14T09:05:00.000Z",
    },
  ];
}

export function simulatePreviewDelay(delayMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}
