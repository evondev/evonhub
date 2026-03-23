import { CourseList, Heading } from "@/shared/components";
import { fetchCoursesIncoming } from "../../actions";
import { CourseItem } from "../../components";

export interface ComingSoonPageProps {}

export async function ComingSoonPage(_props: ComingSoonPageProps) {
  const courses = await fetchCoursesIncoming();
  return (
    <div className="flex flex-col gap-10">
      <Heading>Sắp ra mắt</Heading>
      <CourseList>
        {courses?.map((course) => (
          <CourseItem isIncoming key={course.slug} data={course}></CourseItem>
        ))}
      </CourseList>
    </div>
  );
}
