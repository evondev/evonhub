"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutationCompleteLesson } from "@/shared/data";
import { HistoryItemData } from "@/shared/types/history.types";
import { cn } from "@/shared/utils";
import Link from "next/link";
import {
  startTransition,
  useLayoutEffect,
  useOptimistic,
  useState,
} from "react";

export interface OutlineLessonRowProps {
  title: string;
  id: string;
  isActive?: boolean;
  duration?: number;
  courseId: string;
  histories?: HistoryItemData[];
  userId: string;
}

function getRowClassName(isActive: boolean) {
  return cn(
    "flex items-start gap-2 rounded-xl px-2 py-2 transition-colors",
    isActive && "bg-item-active",
    !isActive && "hover:bg-item-hover",
  );
}

function getTitleClassName(isActive: boolean) {
  return cn(
    "line-clamp-2 min-w-0 flex-1 py-0.5 text-sm",
    isActive && "font-medium text-foreground",
    !isActive && "text-foreground/80",
  );
}

export function OutlineLessonRow({
  title,
  id,
  isActive = false,
  duration,
  courseId,
  histories,
  userId,
}: OutlineLessonRowProps) {
  const mutateCompleteLesson = useMutationCompleteLesson();
  const hasDuration = Number(duration) > 0;

  const defaultChecked = histories
    ?.map((history) => history.lesson._id)
    .includes(id);

  const [isChecked, setIsChecked] = useState(defaultChecked);
  const [isCheckedOptimistic, setIsCheckedOptimistic] =
    useOptimistic(isChecked);

  const handleCompleteLesson = async () => {
    const nextStatus = !isCheckedOptimistic;
    startTransition(async () => {
      setIsCheckedOptimistic(nextStatus);
      try {
        await mutateCompleteLesson.mutateAsync({
          lessonId: id,
          userId,
          courseId,
        });
        setIsChecked(nextStatus);
      } catch (error) {
        setIsCheckedOptimistic(isChecked);
      }
    });
  };

  useLayoutEffect(() => {
    setIsChecked(defaultChecked);
  }, [defaultChecked]);

  return (
    <li>
      <div className={getRowClassName(isActive)} data-lesson-id={id}>
        {/* Ô tick nhỏ 16px cho danh sách dày, vùng bấm 24px nhờ label bọc ngoài */}
        <label className="grid size-6 shrink-0 cursor-pointer place-items-center">
          <Checkbox
            size="sm"
            checked={isCheckedOptimistic}
            onCheckedChange={handleCompleteLesson}
            aria-label={`Đánh dấu đã học: ${title}`}
          />
        </label>
        <Link
          scroll={false}
          href={`?id=${id}`}
          title={title}
          aria-current={isActive ? "page" : undefined}
          className={getTitleClassName(isActive)}
        >
          {title}
        </Link>
        {hasDuration && (
          <span
            className={cn(
              "shrink-0 py-1 pr-1 text-xs tabular-nums",
              isActive && "text-foreground",
              !isActive && "text-muted",
            )}
          >
            {duration} phút
          </span>
        )}
      </div>
    </li>
  );
}
