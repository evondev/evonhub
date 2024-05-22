import CourseItem from "@/components/CourseItem";

const Courses = ({ data }: { data: any[] }) => {
  if (!data) return <div>Loading...</div>;
  if (!data.length) return <div>Chưa có khóa học nào!</div>;
  return (
    <div className="main grid grid-cols-1 lg:grid-cols-3 gap-10">
      {data?.map((course) => (
        <CourseItem key={course.slug} data={course}></CourseItem>
      ))}
    </div>
  );
};

export default Courses;
