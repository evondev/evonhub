import { CourseList, Heading } from "@/shared/components";
import { fetchCoursesIncoming } from "../../actions";
import { CourseItem } from "../../components";

export interface ComingSoonPageProps {}

export async function ComingSoonPage(_props: ComingSoonPageProps) {
  const courses = await fetchCoursesIncoming();
  return (
    <div className="flex flex-col gap-5">
      <Heading>Dự định tương lai</Heading>
      <CourseList>
        {courses?.map((course) => (
          <CourseItem key={course.slug} data={course}></CourseItem>
        ))}
      </CourseList>
    </div>
  );
}
