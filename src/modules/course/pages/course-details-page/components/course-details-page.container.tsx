"use client";

import PageNotFound from "@/app/not-found";
import { useUserContext } from "@/components/user-context";
import { useQueryCourseBySlug } from "@/modules/course/services";
import { useQueryLessonDetailsOutline } from "@/modules/lesson/services";
import { useQueryRatingsByCourse } from "@/modules/rating/services";
import { CourseStatus } from "@/shared/constants/course.constants";
import { useParams } from "next/navigation";
import { CourseDetailsLoading } from "./course-details.loading";
import CourseDetailsView from "./course-details-view";

export interface CourseDetailsPageContainerProps {}

export function CourseDetailsPageContainer(
  _props: CourseDetailsPageContainerProps,
) {
  const params = useParams();

  const { data: courseDetails, isFetching: isFetchingCourse } =
    useQueryCourseBySlug({
      courseSlug: params.slug.toString(),
    });

  const { data: ratings } = useQueryRatingsByCourse({
    courseId: courseDetails?._id.toString() || "",
  });

  const { data: lectures } = useQueryLessonDetailsOutline({
    slug: params.slug.toString(),
  });

  const { userInfo } = useUserContext();

  if (isFetchingCourse) return <CourseDetailsLoading />;

  if (!courseDetails?._id || courseDetails.status === CourseStatus.Rejected)
    return <PageNotFound />;

  const isOwned = Boolean(userInfo?.courses.includes(courseDetails._id));

  return (
    <CourseDetailsView
      course={courseDetails}
      lectures={lectures || []}
      reviews={ratings || []}
      isOwned={isOwned}
    />
  );
}
