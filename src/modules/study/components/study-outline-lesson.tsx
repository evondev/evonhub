import { cn } from "@/shared/utils";
import { Circle, CircleCheck, CirclePlay } from "lucide-react";
import Link from "next/link";
import { StudyLesson } from "../types";

interface StudyOutlineLessonProps {
  lesson: StudyLesson;
  href: string;
}

export function StudyOutlineLesson({ lesson, href }: StudyOutlineLessonProps) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "mx-2 flex h-10 items-center gap-3 rounded-lg pl-8 pr-2 text-sm outline-none transition-colors",
          lesson.isNext && "bg-primary/10 font-medium text-primary-strong",
          !lesson.isNext && "text-foreground/80 hover:bg-item-hover",
        )}
      >
        {lesson.isCompleted && (
          <CircleCheck className="size-4 shrink-0 text-emerald-700 dark:text-emerald-400" />
        )}
        {lesson.isNext && <CirclePlay className="size-4 shrink-0" />}
        {!lesson.isCompleted && !lesson.isNext && (
          <Circle className="size-4 shrink-0 text-muted" />
        )}
        <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
        {lesson.isNext && (
          <span className="shrink-0 text-xs">Bài tiếp theo</span>
        )}
      </Link>
    </li>
  );
}
