import { CourseList, Heading } from "@/shared/components";
import Image from "next/image";
import { fetchCoursesIncoming } from "../../actions";
import CourseItem from "../../components/course-item";

export interface ComingSoonPageProps {}

export async function ComingSoonPage(_props: ComingSoonPageProps) {
  const courses = await fetchCoursesIncoming();
  return (
    <div>
      <Heading>
        Bí kíp sắp ra mắt
        <Image
          alt=""
          src="/meditation2.png"
          width={32}
          height={32}
          className="dark:brightness-0 dark:invert"
        />
      </Heading>
      <CourseList>
        {courses?.map((course) => (
          <CourseItem disabled key={course.slug} data={course}></CourseItem>
        ))}
      </CourseList>
    </div>
  );
}
