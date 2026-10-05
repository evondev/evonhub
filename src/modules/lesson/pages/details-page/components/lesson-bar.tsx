"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils";
import { useGlobalStore } from "@/store";
import { ChevronLeft, ChevronRight, PanelRightOpen } from "lucide-react";
import Link from "next/link";

export interface LessonBarProps {
  title: string;
  chapterTitle?: string;
  duration?: number;
  prevLessonId?: string;
  nextLessonId?: string;
}

// Tên bài và hai nút đi tiếp, ngay dưới video. Tới bài đầu hoặc cuối thì nút
// đó mờ nhưng vẫn giữ chỗ để nút kia không trượt sang.
export function LessonBar({
  title,
  chapterTitle,
  duration,
  prevLessonId,
  nextLessonId,
}: LessonBarProps) {
  const { isExpanded, toggleExpanded } = useGlobalStore();
  const durationLabel = Number(duration) > 0 ? `${duration} phút` : "";
  const meta = [chapterTitle, durationLabel].filter(Boolean).join(" · ");

  return (
    <div className="flex flex-col gap-4 px-4 lg:flex-row lg:items-end lg:justify-between lg:px-0">
      <div className="min-w-0">
        {meta && <p className="text-sm text-muted">{meta}</p>}
        <h1
          className={cn(
            "text-pretty font-display text-xl font-bold text-foreground",
            meta && "mt-1",
          )}
        >
          {title}
        </h1>
      </div>

      {/* Cặp nút ngang hàng nên rộng bằng nhau: mobile chia đôi hàng, từ lg cùng 160px */}
      <div className="grid shrink-0 grid-cols-2 gap-3 lg:flex">
        {/* Nút viền ở đây rê chỉ đậm viền, nền giữ trắng (theo ý chủ dự án) */}
        {isExpanded && (
          <Button
            variant="outline"
            size="icon"
            aria-label="Hiện mục lục"
            title="Hiện mục lục"
            className="hidden hover:border-foreground/25 hover:bg-surface lg:inline-flex"
            onClick={() => toggleExpanded?.(false)}
          >
            <PanelRightOpen className="size-4" />
          </Button>
        )}

        {prevLessonId && (
          <Button
            asChild
            variant="outline"
            className="hover:border-foreground/25 hover:bg-surface lg:min-w-40"
          >
            <Link scroll={false} href={`?id=${prevLessonId}`}>
              <ChevronLeft className="size-4 shrink-0" />
              Bài trước
            </Link>
          </Button>
        )}
        {!prevLessonId && (
          <Button variant="outline" disabled className="lg:min-w-40">
            <ChevronLeft className="size-4 shrink-0" />
            Bài trước
          </Button>
        )}

        {nextLessonId && (
          <Button asChild variant="primary" className="lg:min-w-40">
            <Link scroll={false} href={`?id=${nextLessonId}`}>
              Bài tiếp theo
              <ChevronRight className="size-4 shrink-0" />
            </Link>
          </Button>
        )}
        {!nextLessonId && (
          <Button variant="primary" disabled className="lg:min-w-40">
            Bài tiếp theo
            <ChevronRight className="size-4 shrink-0" />
          </Button>
        )}
      </div>
    </div>
  );
}
