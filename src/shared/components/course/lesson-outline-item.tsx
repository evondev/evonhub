"use client";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconClock, IconPlay } from "@/shared/components";
import { useMutationCompleteLesson } from "@/shared/data";
import { HistoryItemData } from "@/shared/types/history.types";
import { cn } from "@/shared/utils";
import Link from "next/link";
import { useOptimistic } from "react";

export interface LessonOutlineItemProps {
  title: string;
  id?: string;
  isActive?: boolean;
  isCompleted?: boolean;
  duration?: number;
  courseId: string;
  histories?: HistoryItemData[];
  userId: string;
  isPreview?: boolean;
  course?: string;
}

export function LessonOutlineItem({
  title,
  id,
  isActive,
  duration,
  courseId,
  histories,
  userId,
  isPreview,
  course = "",
}: LessonOutlineItemProps) {
  const className = cn(
    "mb-5 pb-5 border-b border-dashed dark:border-b-slate-500 last:pb-0 last:mb-0 last:border-b-0 flex items-center gap-2 dark:text-text5 text-sm",
    isActive ? "text-primary font-bold dark:text-primary" : "font-medium"
  );

  const mutateCompleteLesson = useMutationCompleteLesson();
  const defaultChecked = histories
    ?.map((el) => el.lesson._id)
    .includes(id || "");

  const [checked, setChecked] = useOptimistic(defaultChecked);

  const handleCompleteLesson = async (checked: boolean) => {
    setChecked(!checked);
    try {
      const isChecked = await mutateCompleteLesson.mutateAsync({
        lessonId: id || "",
        userId,
        courseId,
      });
      setChecked(isChecked);
    } catch (error) {}
  };

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
          <TooltipContent className="max-w-xs">{title}</TooltipContent>
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

  const previewButton = isPreview ? (
    <Link
      id={id}
      href={`/${course}/lesson?id=${id}&isPreview=true`}
      className="px-2 py-1 rounded-full bg-primary text-white text-xs font-semibold"
      target="_blank"
      rel="noreferrer"
    >
      Học thử
    </Link>
  ) : null;

  if (!id || !userId) {
    return (
      <div className={className} id={id}>
        {child}
        {previewButton}
      </div>
    );
  }

  return (
    <>
      <div className={className}>
        <Checkbox checked={checked} onCheckedChange={handleCompleteLesson} />

        <Link
          scroll={false}
          id={id}
          className="flex items-center gap-2 flex-1"
          href={`?id=${id}`}
        >
          {child}
        </Link>
      </div>
    </>
  );
}
