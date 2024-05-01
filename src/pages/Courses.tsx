import CourseItem from "@/components/CourseItem";
import { ICourse } from "@/database/course.model";

const Courses = ({ data }: { data: ICourse[] }) => {
  return (
    <div className="main grid grid-cols-3 gap-6">
      {data.map((course) => (
        <CourseItem key={course.slug} data={course}></CourseItem>
      ))}
    </div>
  );
};

export default Courses;
