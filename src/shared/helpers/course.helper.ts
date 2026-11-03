interface ResumeLessonLink {
  _id: string;
  slug: string;
}

/**
 * Id bài đang học dở của khóa, lưu ở localStorage khi mở bài. Chưa có (hay
 * chạy ở server) thì là bài truyền vào, thường là bài đầu tiên
 */
export const getResumeLessonId = (
  slug: string,
  // Không có khi khóa chưa có bài nào
  lesson?: ResumeLessonLink,
): string => {
  if (typeof localStorage === "undefined") return lesson?._id || "";
  const localLessons =
    localStorage && localStorage.getItem("lastCourseLesson")
      ? JSON.parse(localStorage.getItem("lastCourseLesson") || "[]")
      : [];
  const findCourse = localLessons?.find(
    (item: { course: string; lesson: string }) => item.course === slug
  );
  const regex = new RegExp(/^\d+/);

  if (!findCourse || !findCourse.lesson || !regex.test(findCourse?.lesson)) {
    return lesson?._id || "";
  }

  return findCourse.lesson;
};

export const handleGetLastUrl = (
  slug: string,
  // Không có khi khóa chưa có bài nào
  lesson?: ResumeLessonLink
) => `?id=${getResumeLessonId(slug, lesson)}`;
