export const handleGetLastUrl = (
  slug: string,
  lesson: {
    _id: string;
    slug: string;
  }
) => {
  if (typeof localStorage === "undefined") return `?id=${lesson?._id}`;
  const localLessons =
    localStorage && localStorage.getItem("lastCourseLesson")
      ? JSON.parse(localStorage.getItem("lastCourseLesson") || "[]")
      : [];
  const findCourse = localLessons?.find(
    (item: { course: string; lesson: string }) => item.course === slug
  );
  const regex = new RegExp(/^\d+/);

  if (!findCourse || !findCourse.lesson || !regex.test(findCourse?.lesson)) {
    return `?id=${lesson?._id}`;
  }

  return `?id=${findCourse?.lesson}`;
};
