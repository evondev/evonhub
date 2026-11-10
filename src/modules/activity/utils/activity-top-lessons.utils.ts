import { formatThoundsand } from "@/shared/utils";
import { ACTIVITY_TOP_LESSONS_TAB } from "../constants";
import {
  ActivityManageFilters,
  ActivityTopLessonsTab,
  TopLessonRow,
} from "../types";

/** Tab xếp hạng bài học, không phải tab nhật ký */
export function isTopLessonsTab(tab: unknown): tab is ActivityTopLessonsTab {
  return tab === ACTIVITY_TOP_LESSONS_TAB;
}

/** Số phút thành chữ: "45 phút", "2 giờ", "1 giờ 5 phút" */
export function formatStudyMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes} phút`;

  if (minutes === 0) return `${formatThoundsand(hours)} giờ`;

  return `${formatThoundsand(hours)} giờ ${minutes} phút`;
}

/**
 * Bảng xếp hạng của trang xem trước, lọc theo khoá như server sẽ lọc rồi đánh
 * lại hạng. Data giả không biết ai học bài nào, nên có từ khoá tìm người là rỗng
 */
export function filterPreviewTopLessons(
  lessons: TopLessonRow[],
  filters: ActivityManageFilters,
  courseTitleById: Record<string, string>,
): TopLessonRow[] {
  if (filters.search.trim()) return [];

  const courseTitle = courseTitleById[filters.courseId];

  return lessons
    .filter((lesson) => !courseTitle || lesson.courseTitle === courseTitle)
    .map((lesson, index) => ({ ...lesson, rank: index + 1 }));
}
