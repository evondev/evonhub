import { CalendarClock, CircleCheck, Play } from "lucide-react";
import { RoadmapStep } from "../types";
import { CoursePrice } from "./course-price";

interface RoadmapStepStatusProps {
  step: RoadmapStep;
}

/** Chân thẻ lộ trình: sắp ra mắt, tình trạng học của học viên, hoặc giá */
export function RoadmapStepStatus({ step }: RoadmapStepStatusProps) {
  const { course, courseProgress, launchLabel } = step;

  if (!course) {
    return (
      <span className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-foreground/5 px-2 text-xs font-medium text-muted">
        <CalendarClock className="size-3.5" />
        Ra mắt {launchLabel}
      </span>
    );
  }

  if (!courseProgress) return <CoursePrice course={course} />;

  if (courseProgress.progress >= 100) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 dark:text-emerald-400">
        <CircleCheck className="size-4" />
        Đã hoàn thành
      </span>
    );
  }

  if (courseProgress.current === 0) {
    return (
      <span className="text-sm text-muted">
        Chưa bắt đầu · {courseProgress.total} bài
      </span>
    );
  }

  return (
    <span className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 text-xs font-medium text-primary-strong">
      <Play className="size-3.5" />
      Đang học
    </span>
  );
}
