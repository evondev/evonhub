import { fetchUserCoursesContinue } from "@/modules/user/actions";
import { ViewAllLink } from "@/shared/components/common";
import { CourseItemResume } from "@/shared/components/course";
import { CourseResumeList } from "@/shared/components/course/course-resume-list";
import { auth } from "@clerk/nextjs/server";

export interface CourseResumeProps {}

export async function CourseResume(_props: CourseResumeProps) {
  const { userId } = auth();
  const data = await fetchUserCoursesContinue({
    userId: userId || "",
    limit: 3,
  });

  const userCourses = data?.courses || [];
  const userLessons = data?.lessons || [];
  if (userCourses.length === 0) return null;

  return (
    <section className="bgDarkMode rounded-xl p-5 flex flex-col gap-5">
      <div className="flex items-center gap-3 justify-between">
        <h2 className="font-bold text-base lg:text-lg">Khóa học</h2>
        <ViewAllLink href="/study" />
      </div>
      {userCourses.length > 0 && (
        <CourseResumeList className="flex flex-col gap-5">
          {userCourses?.map((course, index) => (
            <CourseItemResume
              key={course._id}
              image={course.image}
              title={course.title}
              courseId={course._id}
              slug={course.slug}
              lesson={userLessons[index]}
            />
          ))}
        </CourseResumeList>
      )}
    </section>
  );
}
