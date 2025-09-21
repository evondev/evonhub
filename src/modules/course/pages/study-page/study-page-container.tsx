"use client";

import { useUserContext } from "@/components/user-context";
import { useQueryUserCourses } from "@/modules/user/services";
import { CourseItemResume } from "@/shared/components/course";
import { CourseResumeList } from "@/shared/components/course/course-resume-list";
import { handleGetLastUrl } from "@/shared/helpers";

export interface StudyPageContainerProps {}

export function StudyPageContainer({}: StudyPageContainerProps) {
  const { userInfo } = useUserContext();
  const userId = userInfo?.clerkId.toString() || "";
  const { data, isFetching } = useQueryUserCourses({
    userId,
  });
  const courses = data?.courses || [];
  const lessons = data?.lessons || [];

  return (
    <CourseResumeList isLoading={isFetching}>
      {courses.map((course, index) => (
        <CourseItemResume
          key={course.slug}
          url={`/${course.slug}/lesson?id=${
            handleGetLastUrl(course.slug) || lessons?.[index]?.[0]?._id
          }`}
          image={course.image}
          title={course.title}
          courseId={course._id}
        ></CourseItemResume>
      ))}
    </CourseResumeList>
  );
}
