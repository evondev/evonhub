import { CourseItem } from "@/modules/course/components";
import { CourseItemData } from "@/modules/course/types";
import { CourseList } from "@/shared/components";

interface PersonalCoursesProps {
  courses: CourseItemData[];
  displayName: string;
}

export function PersonalCourses({ courses, displayName }: PersonalCoursesProps) {
  const hasCourses = courses.length > 0;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex items-baseline gap-2 text-base font-semibold text-foreground">
        Đang học
        {hasCourses && (
          <span className="text-sm font-normal tabular-nums text-muted">
            {courses.length}
          </span>
        )}
      </h2>
      {hasCourses && (
        <CourseList>
          {courses.map((course) => (
            <CourseItem key={course._id} data={course} shouldHideInfo={false} />
          ))}
        </CourseList>
      )}
      {!hasCourses && (
        <div className="rounded-2xl border border-border bg-surface">
          <p className="py-6 text-center text-sm text-muted">
            {displayName} chưa học khóa nào
          </p>
        </div>
      )}
    </section>
  );
}
