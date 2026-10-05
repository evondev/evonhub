import { COURSE_EXTRA_INCLUDES } from "@/modules/course/constants";
import type { CourseCurriculumStats } from "@/modules/course/types";
import { formatDurationMinutes } from "@/modules/course/utils";
import { CirclePlay } from "lucide-react";

export interface CourseIncludesProps {
  stats: CourseCurriculumStats;
}

export default function CourseIncludes({ stats }: CourseIncludesProps) {
  const videoLabel =
    stats.lessonCount > 0
      ? `${stats.lessonCount} bài, ${formatDurationMinutes(stats.totalMinutes)} video full HD`
      : "Video quay full HD";
  const includeItems = [
    { icon: CirclePlay, label: videoLabel },
    ...COURSE_EXTRA_INCLUDES,
  ];

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-foreground">Khóa học gồm</p>
      <ul className="flex flex-col gap-2 text-sm text-foreground/80">
        {includeItems.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-start gap-2.5">
            <Icon className="mt-0.5 size-4 shrink-0 text-muted" aria-hidden />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
