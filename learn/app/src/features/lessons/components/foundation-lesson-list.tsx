import Link from "next/link";
import { FlaskConical } from "lucide-react";
import type { RoadmapLessonSummary } from "../types/roadmap";

interface FoundationLessonListProps {
  lessons: RoadmapLessonSummary[];
}

export default function FoundationLessonList({ lessons }: FoundationLessonListProps) {
  return (
    <section className="space-y-2">
      <h2 className="px-3 text-xs font-medium text-muted">Bài nền tảng · học trước mốc 1</h2>
      <ul className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-1.5">
        {lessons.map((lesson) => (
          <li key={lesson.slug}>
            <Link
              href={`/lessons/${lesson.slug}`}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-item-hover"
            >
              <FlaskConical className="size-4 shrink-0 text-muted" aria-hidden />
              <span className="min-w-0 flex-1 truncate">
                Bài {lesson.number} · {lesson.title}
              </span>
              <span className="shrink-0 text-xs text-muted">
                {lesson.doneCount}/{lesson.totalCount}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
