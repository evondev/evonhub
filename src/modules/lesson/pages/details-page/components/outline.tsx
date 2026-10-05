"use client";

import { Button } from "@/components/ui/button";
import { LessonProgress } from "@/modules/lesson/components";
import { useCourseProgress } from "@/modules/lesson/hooks";
import { useQueryLessonDetailsOutline } from "@/modules/lesson/services";
import { cn } from "@/shared/utils";
import { useGlobalStore } from "@/store";
import { PanelRightClose, RotateCw } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { LoadingOutline } from "./loading-outline";
import { OutlineChapterList } from "./outline-chapter-list";

export interface LessonOutlineProps {
  lessonId: string;
  // panel: cột phải từ lg, dính khi cuộn. tab: nội dung tab Mục lục dưới lg
  variant: "panel" | "tab";
}

export function LessonOutline({ lessonId, variant }: LessonOutlineProps) {
  const params = useParams();
  const courseSlug = params.course?.toString() || "";
  const containerRef = useRef<HTMLDivElement>(null);
  const { isExpanded, toggleExpanded } = useGlobalStore();
  const isPanel = variant === "panel";

  const {
    data: lectures,
    isLoading,
    isError,
    refetch,
  } = useQueryLessonDetailsOutline({ slug: courseSlug });
  const { completedCount, courseId, histories, percent, totalCount, userId } =
    useCourseProgress(courseSlug);

  const scrollToActiveLesson = () => {
    const container = containerRef.current;
    const activeRow = container?.querySelector<HTMLElement>(
      `[data-lesson-id="${lessonId}"]`,
    );
    if (!container || !activeRow) return;

    container.scrollTo({
      top: activeRow.offsetTop - container.offsetTop - activeRow.clientHeight,
      behavior: "smooth",
    });
  };

  // Chờ accordion mở xong chương chứa bài đang học rồi mới cuộn tới bài đó
  useEffect(() => {
    if (!isPanel || !lectures?.length) return;
    const timer = setTimeout(scrollToActiveLesson, 300);

    return () => clearTimeout(timer);
    // Chỉ chạy lại khi đổi bài hoặc mục lục về: scrollToActiveLesson đọc ref
    // và lessonId hiện tại, thêm vào deps sẽ chạy lại mỗi render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId, lectures, isPanel]);

  if (isPanel && isExpanded) return null;

  const head = (
    <div className={cn("shrink-0", isPanel && "p-5 pt-4", !isPanel && "px-4 pb-3 pt-4")}>
      {isPanel && (
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-foreground">
            Nội dung khóa học
          </h2>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Ẩn mục lục"
            title="Ẩn mục lục"
            className="size-9 rounded-xl"
            onClick={() => toggleExpanded?.(true)}
          >
            <PanelRightClose className="size-4" />
          </Button>
        </div>
      )}
      {totalCount > 0 && (
        <LessonProgress
          completedCount={completedCount}
          totalCount={totalCount}
          percent={percent}
          variant="stacked"
        />
      )}
    </div>
  );

  let body = null;
  if (isLoading) body = <LoadingOutline />;
  if (isError) {
    body = (
      <div
        role="alert"
        className="flex flex-col items-center gap-3 border-t border-border px-5 py-10 text-center"
      >
        <p className="text-sm font-medium text-red-600">
          Không tải được mục lục
        </p>
        <Button variant="outline" onClick={() => refetch()}>
          <RotateCw className="size-4" />
          Thử lại
        </Button>
      </div>
    );
  }
  if (lectures?.length) {
    body = (
      <OutlineChapterList
        lectures={lectures}
        lessonId={lessonId}
        courseId={courseId}
        histories={histories}
        userId={userId}
        variant={variant}
      />
    );
  }

  if (!isPanel) {
    return (
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {head}
        {body}
      </div>
    );
  }

  return (
    <aside className="hidden lg:sticky lg:top-[88px] lg:flex lg:max-h-[calc(100vh-112px)] lg:flex-col lg:overflow-hidden lg:rounded-2xl lg:border lg:border-border lg:bg-surface">
      {head}
      <div ref={containerRef} className="scrollbar-auto-hide min-h-0 flex-1 overflow-y-auto">
        {body}
      </div>
    </aside>
  );
}
