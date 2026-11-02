import Link from "next/link";
import { ArrowRight, FileCode2, FlaskConical, MessageSquareText } from "lucide-react";
import type { RoadmapItem } from "../types/roadmap";
import ProgressBar from "./progress-bar";
import RoadmapStatusBadge from "./roadmap-status-badge";
import RoadmapSystemDesign from "./roadmap-system-design";

interface RoadmapDetailProps {
  item: RoadmapItem;
}

// Chi tiết mốc đang chọn ở cột phải của lộ trình.
export default function RoadmapDetail({ item }: RoadmapDetailProps) {
  const hasTestRun = item.passedCount !== undefined && item.checkCount !== undefined;

  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium text-muted">{item.stage}</p>
          <p className="text-lg font-semibold">
            Mốc {item.number} · {item.title}
          </p>
        </div>
        <RoadmapStatusBadge status={item.status} />
      </div>

      {item.summary && <p className="max-w-[75ch] text-sm text-muted">{item.summary}</p>}
      <p className="text-sm">
        <span className="font-medium">Sẽ vấp:</span> <span className="text-muted">{item.problem}.</span>
      </p>

      <RoadmapSystemDesign gameLevels={item.gameLevels} loadTest={item.loadTest} />

      {item.status === "chua-viet" && (
        <div className="flex items-start gap-3 rounded-xl bg-background px-4 py-3 text-sm text-muted">
          <MessageSquareText className="mt-0.5 size-4 shrink-0" aria-hidden />
          Mốc này chưa viết. Xong mốc trước thì nhắn Claude ở gốc repo: &quot;viết mốc {item.number}&quot;. Claude đọc
          learn/journal/ để nhắm đúng chỗ bro còn vướng.
        </div>
      )}

      {item.slug && (
        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex flex-col items-start gap-2 text-xs text-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
            <span className="flex items-center gap-2">
              <FlaskConical className="size-3.5" aria-hidden />
              {hasTestRun ? `${item.passedCount}/${item.checkCount} test xanh` : "Chưa chạy test"}
              {hasTestRun && <ProgressBar doneCount={item.passedCount ?? 0} totalCount={item.checkCount ?? 0} className="w-20" />}
            </span>
            <span className="flex items-center gap-2">
              <FileCode2 className="size-3.5" aria-hidden />
              {item.todoCount} chỗ TODO trong api/
            </span>
            <span>
              {item.doneCount}/{item.totalCount} bước có thao tác
            </span>
          </div>

          {item.lessons.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted">Bài lab mở ra trong mốc</p>
              {item.lessons.map((lesson) => (
                <Link
                  key={lesson.slug}
                  href={`/lessons/${lesson.slug}`}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-item-hover"
                >
                  <FlaskConical className="size-3.5 shrink-0 text-muted" aria-hidden />
                  <span className="min-w-0 flex-1 truncate">
                    Bài {lesson.number} · {lesson.title}
                  </span>
                  <span className="shrink-0 text-xs text-muted">
                    {lesson.doneCount}/{lesson.totalCount} bước
                  </span>
                </Link>
              ))}
            </div>
          )}

          <Link
            href={`/milestones/${item.slug}`}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            {item.doneCount ? "Làm tiếp" : `Bắt đầu mốc ${item.number}`}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      )}
    </div>
  );
}
