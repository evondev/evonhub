"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconClock, IconPlay } from "@/shared/components";
import { cn } from "@/shared/utils";
import { useRouter } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

export interface LessonOutlineItemProps {
  title: string;
  id?: string;
  isActive?: boolean;
  isCompleted?: boolean;
  duration?: number;
}

export function LessonOutlineItem({
  title,
  id,
  isActive,
  duration,
}: LessonOutlineItemProps) {
  const router = useRouter();
  const itemRef = useRef<HTMLDivElement>(null);
  const activeId = "active-lesson-id";

  const className = cn(
    "mb-5 pb-5 border-b border-dashed dark:border-b-slate-500 last:pb-0 last:mb-0 last:border-b-0 flex items-center gap-2 dark:text-text5 text-sm",
    isActive ? "text-primary font-bold dark:text-primary" : "font-medium"
  );

  const handleChangeLesson = () => {
    if (!id) return;
    router.push(id, {
      scroll: false,
    });
  };

  useLayoutEffect(() => {
    const container = document.getElementById("lesson-outline");
    if (container) {
      const item = document.getElementById(activeId);
      container.scrollTo({
        top: (item?.offsetTop ?? 0) - (item?.offsetHeight ?? 0),
      });
    }
  }, []);

  const child = (
    <>
      <IconPlay className="size-5 shrink-0" />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            className={cn(
              "flex-1 text-left",
              isActive ? "pointer-events-none" : "cursor-pointer"
            )}
          >
            <div className="line-clamp-1">{title}</div>
          </TooltipTrigger>
          <TooltipContent>{title}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {Number(duration) > 0 ? (
        <span className="ml-auto font-semibold text-xs flex-shrink-0">
          {duration} phút
        </span>
      ) : (
        <IconClock className="size-5 shrink-0" />
      )}
    </>
  );
  return (
    <div
      ref={itemRef}
      id={isActive ? "active-lesson-id" : ""}
      className={className}
      onClick={handleChangeLesson}
    >
      {child}
    </div>
  );
}
