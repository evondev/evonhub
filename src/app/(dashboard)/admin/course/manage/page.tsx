import EmptyData from "@/components/EmptyData";
import CourseManage from "@/components/course/CourseManage";
import { getAllCourses } from "@/lib/actions/course.action";

const page = async () => {
  const courses = await getAllCourses();
  if (!courses) return <div>Loading...</div>;
  if (!courses.length) return <EmptyData></EmptyData>;
  return (
    <CourseManage
      courses={JSON.parse(JSON.stringify(courses)) || []}
    ></CourseManage>
  );
};

export default page;
