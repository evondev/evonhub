export const handleGetLastUrl = (slug: string) => {
  if (typeof localStorage === "undefined") return;
  const localLessons =
    localStorage && localStorage.getItem("lastCourseLesson")
      ? JSON.parse(localStorage.getItem("lastCourseLesson") || "[]")
      : [];
  const findCourse = localLessons?.find(
    (item: { course: string; lesson: string }) => item.course === slug
  );
  const regex = new RegExp(/^\d+/);
  if (findCourse?.lesson && !regex.test(findCourse?.lesson)) {
    return undefined;
  }
  return findCourse?.lesson;
};
