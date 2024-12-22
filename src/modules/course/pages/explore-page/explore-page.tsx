import { CourseList, Heading } from "@/shared/components";
import { CourseStatus } from "@/shared/constants/course.constants";
import { fetchCourses } from "../../actions";
import CourseItem from "../../components/course-item";

export interface ExplorePageProps {}

export async function ExplorePage(_props: ExplorePageProps) {
  const courses = await fetchCourses({
    status: CourseStatus.Approved,
  });
  return (
    <div>
      <Heading>Khám phá</Heading>
      <CourseList>
        {courses?.map((course) => (
          <CourseItem key={course.slug} data={course}></CourseItem>
        ))}
      </CourseList>
    </div>
  );
}
