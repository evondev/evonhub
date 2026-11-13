import { InterviewCourseSummary } from "../types";
import { InterviewCourseRow } from "./interview-course-row";

interface InterviewCourseListProps {
  courses: InterviewCourseSummary[];
}

export function InterviewCourseList({ courses }: InterviewCourseListProps) {
  const recentCourseId = courses.find((course) => course.lastPracticedAt)?.id;

  return (
    <section className="min-w-0 max-w-3xl rounded-2xl border border-border bg-surface p-2">
      <div className="flex items-center justify-between px-2.5 pb-2 pt-1.5">
        <h2 className="text-base font-semibold text-foreground">Khóa của bạn</h2>
        <span className="text-sm text-muted">{courses.length} khóa</span>
      </div>
      <ul className="flex flex-col gap-1">
        {courses.map((course) => (
          <InterviewCourseRow
            key={course.id}
            course={course}
            isRecent={course.id === recentCourseId}
          />
        ))}
      </ul>
    </section>
  );
}
