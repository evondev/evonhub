"use client";

import { useUserContext } from "@/components/user-context";
import { useQueryUserCourses } from "@/modules/user/services";
import { CourseList } from "@/shared/components";
import CourseItem from "../../components/course-item";

export interface StudyPageContainerProps {}

export function StudyPageContainer({}: StudyPageContainerProps) {
  const { userInfo } = useUserContext();
  const userId = userInfo?.clerkId.toString() || "";
  const { data, isFetching } = useQueryUserCourses({
    userId,
  });
  const courses = data?.courses || [];
  const lessons = data?.lessons || [];

  const handleGetLastUrl = (slug: string) => {
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
  return (
    <CourseList isLoading={isFetching}>
      {courses.map((course, index) => (
        <CourseItem
          key={course.slug}
          data={course}
          cta="Tiếp tục học"
          url={`/lesson/${
            handleGetLastUrl(course.slug) || lessons?.[index]?.[0]?._id
          }`}
        ></CourseItem>
      ))}
    </CourseList>
  );
}
