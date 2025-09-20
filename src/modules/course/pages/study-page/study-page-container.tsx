"use client";

import { useUserContext } from "@/components/user-context";
import { useQueryUserCourses } from "@/modules/user/services";
import { CourseList } from "@/shared/components";
import { handleGetLastUrl } from "@/shared/helpers";
import { CourseItem } from "../../components";

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
    <CourseList isLoading={isFetching}>
      {courses.map((course, index) => (
        <CourseItem
          key={course.slug}
          data={course}
          cta="Tiếp tục học"
          url={`/lesson?id=${
            handleGetLastUrl(course.slug) || lessons?.[index]?.[0]?._id
          }`}
          userId={userInfo?._id}
          shouldHideInfo
        ></CourseItem>
      ))}
    </CourseList>
  );
}
