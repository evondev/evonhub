import { getAllCourses } from "@/lib/actions/course.action";
import Courses from "@/pages/Courses";

const page = async () => {
  const courses = await getAllCourses();
  if (!courses) return <div>Loading...</div>;
  return (
    <div>
      <Courses data={JSON.parse(JSON.stringify(courses)) || []}></Courses>
    </div>
  );
};

export default page;
