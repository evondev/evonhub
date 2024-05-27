"use client";

import CourseItem from "@/components/CourseItem";
import HeadingNChild from "@/components/HeadingNChild";

const Dashboard = ({
  courses = [],
  lessons,
}: {
  courses: any[];
  lessons: any[];
}) => {
  return (
    <>
      <HeadingNChild title="Khu vực học tập">
        {courses.length > 0 &&
          courses?.map((course, index) => (
            <CourseItem
              key={course.slug}
              data={course}
              cta="Tiếp tục học"
              url={`/lesson?slug=${lessons?.[index][0]?.slug}`}
            ></CourseItem>
          ))}
      </HeadingNChild>
    </>
  );
};

export default Dashboard;
