"use client";

import CourseItem from "@/components/CourseItem";

const Dashboard = ({
  courses = [],
  lessons,
}: {
  courses: any[];
  lessons: any[];
}) => {
  return (
    <div>
      <h1 className="text-2xl lg:text-3xl font-extrabold mb-8">
        Khu vực học tập
      </h1>
      <div className="grid xl:grid-cols-3 xl:gap-8 courseSlider">
        {courses.length > 0 &&
          courses?.map((course, index) => (
            <CourseItem
              key={course.slug}
              data={course}
              cta="Tiếp tục học"
              url={`/lesson?slug=${lessons?.[index][0]?.slug}`}
            ></CourseItem>
          ))}
      </div>
    </div>
  );
};

export default Dashboard;
