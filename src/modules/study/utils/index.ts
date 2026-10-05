import { CourseItemData } from "@/modules/course/types";
import { LessonDetailsOutlineData } from "@/shared/types/lesson.types";
import {
  PREVIEW_STUDY_CHAPTERS,
  PREVIEW_STUDY_COURSES,
  STUDY_STATUS_ORDER,
} from "../constants";
import {
  StudyChapter,
  StudyCourse,
  StudyCourseStatus,
  StudyOutline,
} from "../types";

export function getStudyCourseStatus(
  current: number,
  progress: number,
): StudyCourseStatus {
  if (current === 0) return "not-started";
  if (progress >= 100) return "completed";

  return "in-progress";
}

/** Đang học lên đầu, rồi chưa bắt đầu, đã xong; cùng nhóm giữ thứ tự cũ */
export function sortStudyCourses(courses: StudyCourse[]) {
  return [...courses].sort(
    (first, second) =>
      STUDY_STATUS_ORDER[first.status] - STUDY_STATUS_ORDER[second.status],
  );
}

export function getLessonUrl(courseSlug: string, lessonId: string) {
  return `/${courseSlug}/lesson?id=${lessonId}`;
}

/** Khóa đang chọn theo slug trên URL; không có hoặc sai thì lấy khóa đầu */
export function findSelectedStudyCourse(
  courses: StudyCourse[],
  selectedSlug?: string,
) {
  return (
    courses.find((studyCourse) => studyCourse.course.slug === selectedSlug) ||
    courses[0]
  );
}

/**
 * Đề cương theo thứ tự chương rồi bài, đánh dấu bài đã học và bài tiếp theo
 * (bài đầu tiên chưa học).
 */
export function buildStudyOutline(
  lectures: LessonDetailsOutlineData[],
  completedLessonIds: string[],
): StudyOutline {
  const completedIdSet = new Set(completedLessonIds);
  let nextLessonId: string | undefined;

  const chapters: StudyChapter[] = lectures.map((lecture, lectureIndex) => {
    const lessons = (lecture.lessons || []).map((lesson) => {
      const isCompleted = completedIdSet.has(lesson._id);

      if (!isCompleted && !nextLessonId) nextLessonId = lesson._id;

      return {
        id: lesson._id,
        title: lesson.title,
        isCompleted,
        isNext: false,
      };
    });

    return {
      key: `${lectureIndex}-${lecture.title}`,
      title: lecture.title,
      lessons,
      completedCount: lessons.filter((lesson) => lesson.isCompleted).length,
    };
  });
  const allLessons = chapters.flatMap((chapter) => chapter.lessons);

  for (const lesson of allLessons) lesson.isNext = lesson.id === nextLessonId;

  return {
    chapters,
    nextLesson: allLessons.find((lesson) => lesson.isNext),
    firstLesson: allLessons[0],
  };
}

/** Chương mở sẵn: chương có bài tiếp theo; học hết thì chương đầu */
export function getDefaultOpenChapterKey(outline: StudyOutline) {
  const nextChapter = outline.chapters.find((chapter) =>
    chapter.lessons.some((lesson) => lesson.isNext),
  );

  return (nextChapter || outline.chapters[0])?.key;
}

/** Khóa mẫu cho trang xem trước ở dev. Ép kiểu vì chỉ đọc trường hiển thị */
export function buildPreviewStudyCourses(): StudyCourse[] {
  return sortStudyCourses(
    PREVIEW_STUDY_COURSES.map((seed) => {
      const progress = Math.round((seed.current / seed.total) * 100);

      return {
        course: {
          _id: seed.slug,
          slug: seed.slug,
          title: seed.title,
          image: seed.image,
        } as unknown as CourseItemData,
        progress,
        current: seed.current,
        total: seed.total,
        status: getStudyCourseStatus(seed.current, progress),
      };
    }),
  );
}

/** Đề cương mẫu: đánh dấu đã học đúng số bài bằng tiến độ của khóa */
export function buildPreviewStudyOutline(
  studyCourse: StudyCourse,
): StudyOutline {
  let lessonIndex = 0;
  const lectures = PREVIEW_STUDY_CHAPTERS.map(
    (chapter) =>
      ({
        title: chapter.title,
        lessons: chapter.lessons.map((title) => {
          lessonIndex += 1;

          return { _id: `${studyCourse.course.slug}-${lessonIndex}`, title };
        }),
      }) as unknown as LessonDetailsOutlineData,
  );
  const lessonCount = lessonIndex;
  const completedCount = Math.round((studyCourse.progress / 100) * lessonCount);
  const completedIds = Array.from(
    { length: completedCount },
    (_, index) => `${studyCourse.course.slug}-${index + 1}`,
  );

  return buildStudyOutline(lectures, completedIds);
}
