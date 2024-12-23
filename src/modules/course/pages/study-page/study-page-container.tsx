"use client";

import { CourseList } from "@/shared/components";
import CourseItem from "../../components/course-item";
import { CourseItemData } from "../../types";

export interface StudyPageContainerProps {
  courses?: CourseItemData[];
  lessons?: any[];
}

export function StudyPageContainer({
  courses = [],
  lessons = [],
}: StudyPageContainerProps) {
  if (!courses.length || !lessons.length) return null;

  const handleGetLastUrl = (slug: string) => {
    const localLessons =
      localStorage && localStorage.getItem("lastCourseLesson")
        ? JSON.parse(localStorage.getItem("lastCourseLesson") || "[]")
        : [];
    const findCourse = localLessons?.find(
      (item: { course: string; lesson: string }) => item.course === slug
    );
    return findCourse?.lesson;
  };
  return (
    <CourseList>
      {courses.map((course, index) => (
        <CourseItem
          key={course.slug}
          data={course}
          cta="Tiếp tục học"
          url={`/lesson?slug=${
            handleGetLastUrl(course.slug) || lessons?.[index][0]?.slug
          }`}
        ></CourseItem>
      ))}
    </CourseList>
  );
}
