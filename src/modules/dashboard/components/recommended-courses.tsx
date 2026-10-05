import { fetchCourses } from "@/modules/course/actions";
import { CourseStatus } from "@/shared/constants/course.constants";
import { RECOMMENDED_COURSE_LIMIT } from "../constants";
import { CourseGridSection } from "./course-grid-section";

interface RecommendedCoursesProps {
  title: string;
  shouldFilterEnrolled?: boolean;
}

export async function RecommendedCourses({
  title,
  shouldFilterEnrolled = false,
}: RecommendedCoursesProps) {
  const courses = await fetchCourses({
    status: CourseStatus.Approved,
    limit: RECOMMENDED_COURSE_LIMIT,
    isFree: false,
    isAll: false,
    shouldFilterEnrolled,
  });

  return <CourseGridSection title={title} courses={courses || []} />;
}
