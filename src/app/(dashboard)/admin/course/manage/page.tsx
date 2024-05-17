import CourseManage from "@/components/course/CourseManage";
import { getAllCourses } from "@/lib/actions/course.action";

const page = async () => {
  const courses = await getAllCourses({
    status: undefined,
  });
  if (!courses) return <div>Loading...</div>;
  return (
    <CourseManage
      courses={JSON.parse(JSON.stringify(courses)) || []}
    ></CourseManage>
  );
};

export default page;
