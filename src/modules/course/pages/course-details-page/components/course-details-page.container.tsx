"use client";

import { useUserContext } from "@/components/user-context";
import type { CourseItemData } from "@/modules/course/types";
import type { RatingItemData } from "@/modules/rating/types";
import { LessonDetailsOutlineData } from "@/shared/types";
import CourseDetailsView from "./course-details-view";

export interface CourseDetailsPageContainerProps {
  course: CourseItemData;
  lectures: LessonDetailsOutlineData[];
  reviews: RatingItemData[];
}

/** Dữ liệu khóa đến từ server; ở client chỉ còn biết người xem đã mua chưa */
export function CourseDetailsPageContainer({
  course,
  lectures,
  reviews,
}: CourseDetailsPageContainerProps) {
  const { userInfo } = useUserContext();

  const isOwned = Boolean(userInfo?.courses.includes(course._id));

  return (
    <CourseDetailsView
      course={course}
      lectures={lectures}
      reviews={reviews}
      isOwned={isOwned}
    />
  );
}
