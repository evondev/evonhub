import { fetchCourses } from "@/modules/course/actions";
import { CourseItem } from "@/modules/course/components";
import { CourseList } from "@/shared/components";
import { ViewAllLink } from "@/shared/components/common";
import { CourseStatus } from "@/shared/constants/course.constants";

export interface CourseSuggestionProps {}

export async function CourseSuggestion(_props: CourseSuggestionProps) {
  const courses = await fetchCourses({
    status: CourseStatus.Approved,
    limit: 4,
    isFree: false,
    isAll: false,
    shouldFilterEnrolled: true,
  });
  return (
    <section>
      <div className="flex items-center gap-3 justify-between mb-5">
        <h2 className="font-bold text-lg lg:text-2xl">Đề xuất</h2>
        <ViewAllLink href="/explore" />
      </div>
      <CourseList>
        {courses?.map((course, index) => (
          <CourseItem key={index} data={course}></CourseItem>
        ))}
      </CourseList>
    </section>
  );
}
