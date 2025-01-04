"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconClock, IconPlay } from "@/shared/components";
import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { getQueryClient } from "@/shared/libs";
import { cn } from "@/shared/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getLessonById } from "../actions";

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
  isCompleted,
  duration,
}: LessonOutlineItemProps) {
  const router = useRouter();
  const queryClient = getQueryClient();

  const className = cn(
    "mb-5 pb-5 border-b border-dashed dark:border-b-slate-500 last:pb-0 last:mb-0 last:border-b-0 flex items-center gap-2 dark:text-text5 text-sm",
    isActive ? "text-primary font-bold dark:text-primary" : "font-medium"
  );

  useEffect(() => {
    if (!id) return;
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.GET_LESSON_BY_ID, id],
      queryFn: () => getLessonById(id),
    });
  }, [id]);

  const handleChangeLesson = () => {
    if (!id) return;
    router.push(id, {
      scroll: false,
    });
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
    <div className={className} onClick={handleChangeLesson}>
      {child}
    </div>
  );
}
