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
    <section className="bgDarkMode rounded-xl p-5 w-full flex flex-col gap-5">
      <div className="flex items-center gap-3 justify-between">
        <h2 className="font-bold text-base lg:text-lg">Đề xuất</h2>
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
