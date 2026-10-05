import { CourseCover } from "@/shared/components/course";
import { ProgressBar } from "@/shared/components/common";
import { StudyCourse } from "../types";

interface StudyCourseRowContentProps {
  studyCourse: StudyCourse;
}

export function StudyCourseRowContent({
  studyCourse,
}: StudyCourseRowContentProps) {
  const { course, status, progress, total } = studyCourse;

  return (
    <>
      <CourseCover
        image={course.image}
        sizes="80px"
        className="aspect-video w-20 shrink-0 rounded-lg"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
          {course.title}
        </h3>
        {status === "not-started" ? (
          <span className="text-xs text-muted">Chưa bắt đầu · {total} bài</span>
        ) : (
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <ProgressBar
                progress={progress}
                className="h-2 bg-foreground/5 dark:bg-foreground/5"
              />
            </div>
            <span className="text-xs tabular-nums text-foreground/70">
              {progress}%
            </span>
          </div>
        )}
      </div>
    </>
  );
}
