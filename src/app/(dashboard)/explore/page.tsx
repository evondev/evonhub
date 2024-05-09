import { getAllCourses } from "@/lib/actions/course.action";
import Courses from "@/pages/Courses";
import { ECourseStatus } from "@/types/enums";

const page = async () => {
  const courses = await getAllCourses({
    status: ECourseStatus.APPROVED,
  });
  if (!courses) return <div>Loading...</div>;
  return (
    <div>
      <Courses data={JSON.parse(JSON.stringify(courses)) || []}></Courses>
    </div>
  );
};

export default page;
