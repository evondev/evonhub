import { getAllCourses } from "@/lib/actions/course.action";
import Courses from "@/pages/Courses";
import { ECourseStatus } from "@/types/enums";

const page = async () => {
  const courses = await getAllCourses({
    status: ECourseStatus.APPROVED,
  });
  return (
    <>
      <h1 className="text-3xl font-extrabold mb-8">Khám phá</h1>
      <Courses data={JSON.parse(JSON.stringify(courses)) || []}></Courses>
    </>
  );
};

export default page;
