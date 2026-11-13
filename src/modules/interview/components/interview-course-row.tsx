import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/shared/components/common";
import { CourseCover } from "@/shared/components/course";
import Link from "next/link";
import { INTERVIEW_PATH } from "../constants";
import { InterviewCourseSummary } from "../types";
import { getProgressPercent } from "../utils";
import { InterviewCourseMeta } from "./interview-course-meta";

interface InterviewCourseRowProps {
  course: InterviewCourseSummary;
  /** Khoá vừa luyện gần nhất: nút "Luyện tiếp" là nút chính của trang */
  isRecent: boolean;
}

function getActionLabel(course: InterviewCourseSummary) {
  if (!course.answeredCount) return "Bắt đầu";
  if (course.answeredCount >= course.totalQuestions) return "Ôn lại";

  return "Luyện tiếp";
}

export function InterviewCourseRow({ course, isRecent }: InterviewCourseRowProps) {
  const progress = getProgressPercent(course.answeredCount, course.totalQuestions);
  const href = `${INTERVIEW_PATH}/${course.slug}`;

  return (
    <li className="relative flex min-w-0 items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-item-hover">
      <CourseCover
        image={course.image}
        sizes="96px"
        className="aspect-video w-20 shrink-0 rounded-lg sm:w-24"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
          {/* Cả dòng bấm được, nút bên phải chỉ để nhìn ra việc tiếp theo */}
          <Link href={href} className="outline-none before:absolute before:inset-0">
            {course.title}
          </Link>
        </h3>
        <div className="flex items-center justify-between gap-2 text-xs">
          <InterviewCourseMeta course={course} />
          <span className="shrink-0 tabular-nums text-foreground/70">
            {progress}%
          </span>
        </div>
        <ProgressBar
          progress={progress}
          className="h-2 bg-foreground/5 dark:bg-foreground/5"
        />
      </div>
      <Button
        asChild
        size="sm"
        variant={isRecent ? "primary" : "outline"}
        className="relative hidden shrink-0 sm:inline-flex"
      >
        <Link href={href} tabIndex={-1}>
          {getActionLabel(course)}
        </Link>
      </Button>
    </li>
  );
}
