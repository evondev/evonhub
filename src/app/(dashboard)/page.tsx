import HeadingNChild from "@/components/HeadingNChild";
import Courses from "@/components/pages/Courses";
import { getAllCourses } from "@/lib/actions/course.action";
import { ECourseStatus } from "@/types/enums";
export const maxDuration = 60;

const page = async () => {
  const courses = await getAllCourses({
    status: ECourseStatus.APPROVED,
  });
  return (
    <>
      <HeadingNChild title="Khám phá">
        <Courses
          data={courses ? JSON.parse(JSON.stringify(courses)) : []}
        ></Courses>
      </HeadingNChild>
    </>
  );
};

export default page;
