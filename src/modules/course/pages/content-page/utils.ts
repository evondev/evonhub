import { sumLessonMinutes } from "@/modules/course/utils";
import { move, reorder } from "@/utils";
import type { DraggableLocation } from "react-beautiful-dnd";
import type {
  ContentLecture,
  ContentLesson,
  CourseContentStats,
  LessonDragOutcome,
  LessonIssues,
  LessonLocation,
} from "./types";

export function buildCourseContentPath(courseSlug: string): string {
  return `/admin/course/content?slug=${courseSlug}`;
}

/** Nội dung TinyMCE rỗng vẫn có thể còn thẻ trống như <p></p> */
function hasTextContent(html: string | undefined): boolean {
  if (!html) return false;

  return html.replace(/<[^>]*>|&nbsp;/g, "").trim().length > 0;
}

export function getLessonIssues(lesson: ContentLesson): LessonIssues {
  return {
    isMissingVideo: !lesson.video?.trim() && !lesson.iframe?.trim(),
    isMissingContent: !hasTextContent(lesson.content),
  };
}

export function getCourseContentStats(
  lectures: ContentLecture[],
): CourseContentStats {
  const lessons = lectures.flatMap((lecture) => lecture.lessons);

  return {
    chapterCount: lectures.length,
    lessonCount: lessons.length,
    totalMinutes: sumLessonMinutes(lessons),
    missingVideoCount: lessons.filter(
      (lesson) => getLessonIssues(lesson).isMissingVideo,
    ).length,
  };
}

export function findLessonLocation(
  lectures: ContentLecture[],
  lessonId: string,
): LessonLocation | null {
  for (const lecture of lectures) {
    const lessonIndex = lecture.lessons.findIndex(
      (lesson) => lesson._id === lessonId,
    );

    if (lessonIndex >= 0) {
      return { lecture, lesson: lecture.lessons[lessonIndex], lessonIndex };
    }
  }

  return null;
}

/** Bài đang chọn đã bị xoá hoặc chưa chọn bài nào thì rơi về bài đầu tiên */
export function resolveLessonLocation(
  lectures: ContentLecture[],
  lessonId: string,
): LessonLocation | null {
  const selectedLocation = findLessonLocation(lectures, lessonId);
  if (selectedLocation) return selectedLocation;

  const firstLecture = lectures.find((lecture) => lecture.lessons.length > 0);
  if (!firstLecture) return null;

  return {
    lecture: firstLecture,
    lesson: firstLecture.lessons[0],
    lessonIndex: 0,
  };
}

/** Danh sách chương sau khi thả một bài: cùng chương thì đổi thứ tự, khác chương thì chuyển bài */
export function getLecturesAfterDrag(
  lectures: ContentLecture[],
  source: DraggableLocation,
  destination: DraggableLocation,
): LessonDragOutcome {
  const isSameLecture = destination.droppableId === source.droppableId;
  const sourceIndex = lectures.findIndex(
    (lecture) => lecture._id === source.droppableId,
  );
  const destinationIndex = lectures.findIndex(
    (lecture) => lecture._id === destination.droppableId,
  );
  const nextLectures = Array.from(lectures);

  if (isSameLecture) {
    const lessons = reorder(
      lectures[sourceIndex].lessons,
      source.index,
      destination.index,
    ) as ContentLesson[];
    nextLectures[sourceIndex] = { ...nextLectures[sourceIndex], lessons };

    return {
      lectures: nextLectures,
      isSameLecture,
      destinationLessons: lessons,
    };
  }

  const movedLessons = move(
    lectures[sourceIndex].lessons,
    lectures[destinationIndex].lessons,
    source,
    destination,
  );
  nextLectures[sourceIndex] = {
    ...nextLectures[sourceIndex],
    lessons: movedLessons[source.droppableId],
  };
  nextLectures[destinationIndex] = {
    ...nextLectures[destinationIndex],
    lessons: movedLessons[destination.droppableId],
  };

  return {
    lectures: nextLectures,
    isSameLecture,
    destinationLessons: movedLessons[destination.droppableId],
  };
}
