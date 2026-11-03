"use client";

import { useQueryLessonSummary } from "@/modules/lesson/services";
import { getResumeLessonId } from "@/shared/helpers";
import { useEffect, useState } from "react";
import { DashboardLessonLink, ResumeLessonSummary } from "../types";

/**
 * Tên và số phút của bài mà nút "Học tiếp" sẽ mở. Bài đang học dở nằm trong
 * localStorage nên chỉ biết sau khi mount: trùng bài server đã gửi thì dùng
 * luôn, khác thì hỏi server tên bài đó
 */
export function useResumeLessonSummary(
  slug: string,
  lesson?: DashboardLessonLink,
): ResumeLessonSummary {
  const defaultLessonId = lesson?._id || "";
  // null là chưa đọc localStorage: chưa biết bài nào, chưa hiện tên để khỏi
  // hiện tên bài đầu rồi đổi sang bài khác
  const [resumeLessonId, setResumeLessonId] = useState<string | null>(null);

  useEffect(() => {
    setResumeLessonId(getResumeLessonId(slug, lesson));
  }, [slug, lesson]);

  const isDefaultLesson = resumeLessonId === defaultLessonId;
  const lessonSummaryQuery = useQueryLessonSummary({
    lessonId: resumeLessonId || "",
    enabled: resumeLessonId !== null && !isDefaultLesson,
  });

  if (resumeLessonId === null) return { isFirstLesson: false, isLoading: true };

  if (isDefaultLesson) {
    return {
      isFirstLesson: true,
      title: lesson?.title,
      duration: lesson?.duration,
      isLoading: false,
    };
  }

  return {
    isFirstLesson: false,
    title: lessonSummaryQuery.data?.title,
    duration: lessonSummaryQuery.data?.duration,
    isLoading: lessonSummaryQuery.isPending,
  };
}
