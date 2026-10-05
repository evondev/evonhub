"use client";

import { useUserContext } from "@/components/user-context";
import { useQueryCourseBySlug } from "@/modules/course/services";
import { useQueryHistoriesByUser } from "@/modules/history/services";
import { useQueryLessonsByCourseId } from "@/modules/lesson/services";

/**
 * Tiến độ của người đang xem trong một khóa: số bài đã học trên tổng số bài.
 * Header, mục lục và pháo hoa cùng đọc một nguồn nên số luôn khớp nhau.
 */
export function useCourseProgress(courseSlug: string) {
  const { userInfo } = useUserContext();
  const userId = userInfo?._id || "";

  const { data: courseDetails } = useQueryCourseBySlug({ courseSlug });
  const courseId = courseDetails?._id?.toString() || "";

  const { data: lessonList } = useQueryLessonsByCourseId({
    courseId,
    enabled: !!courseId,
  });
  const { data: histories } = useQueryHistoriesByUser({ userId, courseId });

  const completedCount = histories?.length ?? 0;
  const totalCount = lessonList?.length ?? 0;
  const percent = totalCount
    ? Math.floor((completedCount / totalCount) * 100)
    : 0;

  return {
    completedCount,
    courseDetails,
    courseId,
    histories,
    percent,
    totalCount,
    userId,
  };
}
