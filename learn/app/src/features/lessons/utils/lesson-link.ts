import type { Lesson, LessonLink } from "../types/lesson";

// Tách khỏi lesson-lookup: file mốc gọi hàm này lúc khai báo, còn lesson-lookup lại import danh mục mốc.
export function toLessonLink(lesson: Lesson): LessonLink {
  return {
    slug: lesson.slug,
    number: lesson.number,
    title: lesson.title,
    summary: lesson.summary,
    minutes: lesson.minutes,
  };
}
