import { CourseStatus } from "@/shared/constants/course.constants";
import { FilterTabItem } from "@/shared/types";
import { formatThoundsand } from "@/shared/utils";
import { COURSE_MANAGE_TABS } from "../constants/course-manage.constants";
import type { CourseItemData } from "../types";
import {
  CourseManageFilters,
  CourseManageRow,
  CourseManageTab,
  CourseManageTabCounts,
} from "../types/course-manage.types";
import { isCourseFree } from "./index";

export function toCourseManageRow(course: CourseItemData): CourseManageRow {
  return {
    id: String(course._id),
    slug: course.slug,
    title: course.title,
    image: course.image || undefined,
    status: course.status,
    price: course.price,
    isFree: isCourseFree(course),
    studentCount: course.studentCount || 0,
    createdAt: course.createdAt,
  };
}

/** Tab "Tất cả" không lọc trạng thái */
export function getCourseManageStatus(
  tab: CourseManageTab,
): CourseStatus | undefined {
  return tab === "all" ? undefined : tab;
}

/** Gắn số đếm vào tab; chưa có số (lần tải đầu) thì tab chỉ ghi chữ */
export function buildCourseManageTabs(
  tabCounts?: CourseManageTabCounts,
): FilterTabItem<CourseManageTab>[] {
  return COURSE_MANAGE_TABS.map((tab) => ({
    ...tab,
    count: tabCounts?.[tab.value],
  }));
}

export function buildCourseContentHref(course: CourseManageRow): string {
  return `/admin/course/content?slug=${course.slug}`;
}

export function buildCourseUpdateHref(course: CourseManageRow): string {
  return `/admin/course/update?slug=${course.slug}`;
}

export function buildCoursePublicHref(course: CourseManageRow): string {
  return `/course/${course.slug}`;
}

export function formatCourseManagePrice(course: CourseManageRow): string {
  if (course.isFree) return "Miễn phí";

  return `${formatThoundsand(course.price)} đ`;
}

/** Lọc danh sách giả của trang xem trước giống cách server lọc */
export function filterPreviewCourses(
  courses: CourseManageRow[],
  filters: CourseManageFilters,
): CourseManageRow[] {
  const keyword = filters.search.toLowerCase();
  const status = getCourseManageStatus(filters.tab);

  return courses.filter((course) => {
    if (keyword && !course.title.toLowerCase().includes(keyword)) return false;
    if (status && course.status !== status) return false;
    if (filters.isFree && !course.isFree) return false;

    return true;
  });
}

/** Số đếm từng tab của trang xem trước, tính trên danh sách giả như server sẽ đếm */
export function countPreviewCourseTabs(
  courses: CourseManageRow[],
  filters: CourseManageFilters,
): CourseManageTabCounts {
  const countTab = (tab: CourseManageTab) =>
    filterPreviewCourses(courses, { ...filters, tab }).length;

  return {
    all: countTab("all"),
    [CourseStatus.Approved]: countTab(CourseStatus.Approved),
    [CourseStatus.Pending]: countTab(CourseStatus.Pending),
    [CourseStatus.Rejected]: countTab(CourseStatus.Rejected),
    [CourseStatus.Archived]: countTab(CourseStatus.Archived),
  };
}
