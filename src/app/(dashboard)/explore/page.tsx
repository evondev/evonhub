import { getAllCourses } from "@/lib/actions/course.action";
import Courses from "@/pages/Courses";
import { ECourseStatus } from "@/types/enums";
export const maxDuration = 60;

const page = async () => {
  const courses = await getAllCourses({
    status: ECourseStatus.APPROVED,
  });
  return (
    <>
      <h1 className="text-2xl lg:text-3xl font-extrabold mb-8">Khám phá</h1>
      <Courses
        data={courses ? JSON.parse(JSON.stringify(courses)) : []}
      ></Courses>
    </>
  );
};

export default page;
