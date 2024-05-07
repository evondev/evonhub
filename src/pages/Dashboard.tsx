"use client";

import CourseItem from "@/components/CourseItem";
import { ICourse } from "@/database/course.model";

const Dashboard = ({
  courses,
  lessons,
}: {
  courses: ICourse[];
  lessons: any[];
}) => {
  const url = `/lesson/${lessons[0].slug}`;
  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-10">Khu vực học tập</h1>
      <div className="grid lg:grid-cols-3 gap-5">
        {courses.map((course) => (
          <CourseItem
            key={course.slug}
            data={course}
            cta="Tiếp tục học"
            url={url}
          ></CourseItem>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
