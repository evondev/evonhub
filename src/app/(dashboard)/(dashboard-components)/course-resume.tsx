import { fetchUserCoursesContinue } from "@/modules/user/actions";
import { CourseItemResume } from "@/shared/components/course";
import { CourseResumeList } from "@/shared/components/course/course-resume-list";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export interface CourseResumeProps {}

export async function CourseResume(_props: CourseResumeProps) {
  const { userId } = auth();
  const data = await fetchUserCoursesContinue({
    userId: userId || "",
    limit: 3,
  });

  const userCourses = data?.courses || [];
  const userLessons = data?.lessons || [];
  return (
    <section>
      <div className="flex items-center gap-3 justify-between mb-5">
        <h2 className="font-bold text-lg lg:text-2xl">Khóa học</h2>
        <Link
          href="/study"
          className="font-bold text-primary capitalize text-sm lg:text-base"
        >
          Xem tất cả
        </Link>
      </div>
      <CourseResumeList>
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
    </section>
  );
}
