import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Lesson } from "../types/lesson";
import type { Milestone } from "../types/milestone";

interface LessonFooterNavProps {
  milestone?: Milestone;
  nextLesson?: Lesson;
}

export default function LessonFooterNav({ milestone, nextLesson }: LessonFooterNavProps) {
  // Bài lab mở ra giữa một mốc: học xong thì quay lại làm cho xong mốc.
  if (milestone) {
    return (
      <Link
        href={`/milestones/${milestone.slug}`}
        className="group flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-strong sm:p-5"
      >
        <ArrowLeft className="size-5 shrink-0 text-muted transition-colors group-hover:text-foreground" aria-hidden />
        <span className="min-w-0 space-y-1">
          <span className="block text-xs font-medium text-muted">Quay lại làm tiếp mốc {milestone.number}</span>
          <span className="block text-base font-semibold">{milestone.title}</span>
        </span>
      </Link>
    );
  }

  if (!nextLesson) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4 text-sm text-muted sm:p-5">
        Đây là bài cuối hiện có. Học xong thì nhắn Claude Code để viết bài tiếp theo, nó sẽ đọc learn/journal/ để biết bro đang
        vướng ở đâu.
      </div>
    );
  }

  return (
    <Link
      href={`/lessons/${nextLesson.slug}`}
      className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-strong sm:p-5"
    >
      <span className="min-w-0 space-y-1">
        <span className="block text-xs font-medium text-muted">Bài tiếp theo · {nextLesson.stage}</span>
        <span className="block text-base font-semibold">{nextLesson.title}</span>
      </span>
      <ArrowRight className="size-5 shrink-0 text-muted transition-colors group-hover:text-foreground" aria-hidden />
    </Link>
  );
}
