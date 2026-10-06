import { fetchCourseBySlug } from "@/modules/course/actions";
import { incrementCourseViews } from "@/modules/course/services/course-views.service";
import { fetchLessonDetailsOutline } from "@/modules/lesson/actions";
import { fetchRatingsByCourse } from "@/modules/rating/actions";
import { CourseStatus } from "@/shared/constants/course.constants";
import { notFound } from "next/navigation";
import { CourseDetailsPageContainer } from "./course-details-page.container";

interface CourseDetailsContentProps {
  slug: string;
}

/** Đọc khóa, mục lục, đánh giá trên server để HTML trả về có sẵn nội dung */
export async function CourseDetailsContent({ slug }: CourseDetailsContentProps) {
  const [course, lectures] = await Promise.all([
    fetchCourseBySlug(slug),
    fetchLessonDetailsOutline(slug),
    incrementCourseViews(slug),
  ]);

  const isHiddenFromSale =
    course?.status === CourseStatus.Rejected ||
    course?.status === CourseStatus.Archived;

  if (!course?._id || isHiddenFromSale) notFound();

  const reviews = await fetchRatingsByCourse({
    courseId: course._id.toString(),
  });

  return (
    <CourseDetailsPageContainer
      course={course}
      lectures={lectures || []}
      reviews={reviews || []}
    />
  );
}
