"use client";
import { completeLesson } from "@/lib/actions/history.action";
import { cn } from "@/lib/utils";
import { formUrlQuery } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { IconPlay } from "../icons";
import { Checkbox } from "../ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const LessonItem = ({
  title,
  url,
  isActive,
  isCompleted,
  data,
  path,
}: {
  title: string;
  url?: string;
  isActive?: boolean;
  isCompleted?: boolean;
  path?: string;
  data?: {
    courseId?: string;
    lessonId?: string;
    userId?: string;
    duration?: number;
  };
}) => {
  const base = cn(
    "mb-5 pb-5 border-b border-dashed dark:border-b-slate-500 last:pb-0 last:mb-0 last:border-b-0 flex items-center gap-2 dark:text-text5 text-sm",
    isActive ? "text-primary font-bold dark:text-primary" : "font-medium"
  );
  const searchParams = useSearchParams();
  const [isChecked, setIsChecked] = useState(isCompleted);
  const router = useRouter();
  const handleChangeLesson = () => {
    const newUrl = formUrlQuery({
      params: searchParams?.toString() || "",
      key: "slug",
      value: url || "",
    });
    router.push(newUrl);
  };
  const handleCompleteLesson = async () => {
    setIsChecked(!isChecked);
    if (!data) return;
    try {
      await completeLesson({
        lessonId: data.lessonId || "",
        userId: data.userId || "",
        courseId: data.courseId || "",
        path,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const child = (
    <>
      <Checkbox
        checked={isChecked}
        onCheckedChange={() => handleCompleteLesson()}
      />

      <IconPlay className="size-5 shrink-0" />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            className={cn(
              "flex-1 text-left",
              isActive ? "pointer-events-none" : "cursor-pointer"
            )}
            onClick={handleChangeLesson}
          >
            <div className="line-clamp-1">{title}</div>
          </TooltipTrigger>
          <TooltipContent>{title}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <span className="ml-auto font-semibold text-xs flex-shrink-0">
        {data?.duration} phút
      </span>
    </>
  );

  if (url) return <div className={base}>{child}</div>;
  return <div className={base}>{child}</div>;
};

export default LessonItem;
