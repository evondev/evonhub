import { ViewAllLink } from "@/shared/components/common";
import { cn } from "@/shared/utils";
import { DashboardCourseProgress } from "../types";
import { CourseProgressRow } from "./course-progress-row";

interface CourseProgressCardProps {
  courses: DashboardCourseProgress[];
}

export function CourseProgressCard({ courses }: CourseProgressCardProps) {
  return (
    <section className="flex min-w-0 flex-col rounded-2xl border border-border bg-surface py-4 sm:py-5">
      <header className="flex items-center justify-between gap-3 px-4 sm:px-5">
        <div className="flex min-h-10 items-center">
          <h2 className="text-base font-semibold text-foreground">
            Khóa đang học khác
          </h2>
        </div>
        <ViewAllLink href="/study" text="Khóa học của tôi" />
      </header>
      {courses.length > 0 ? (
        <ul
          className={cn(
            "grid grid-cols-1 gap-0.5 px-1 sm:px-2",
            courses.length > 1 && "lg:grid-cols-2 lg:gap-x-2",
          )}
        >
          {courses.map((courseProgress) => (
            <CourseProgressRow
              key={courseProgress.course._id}
              courseProgress={courseProgress}
            />
          ))}
        </ul>
      ) : (
        <p className="px-4 py-6 text-center text-sm text-muted">
          Bạn đã học xong mọi khóa đang có
        </p>
      )}
    </section>
  );
}
