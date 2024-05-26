import CourseItem from "@/components/CourseItem";
import EmptyData from "@/components/EmptyData";

const Courses = ({ data }: { data: any[] }) => {
  if (!data) return <div>Loading...</div>;
  if (!data.length) return <EmptyData text="Chưa có khóa học nào!" />;
  return (
    <div className="grid xl:grid-cols-3 xl:gap-8 courseSlider">
      {data?.map((course) => (
        <CourseItem key={course.slug} data={course}></CourseItem>
      ))}
    </div>
  );
};

export default Courses;
