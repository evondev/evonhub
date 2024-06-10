"use client";
import { completeLesson } from "@/lib/actions/history.action";
import { cn } from "@/lib/utils";
import { formUrlQuery } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { IconPlay } from "../icons";
import { Checkbox } from "../ui/checkbox";

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
    courseId: string;
    lessonId: string;
    userId: string;
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
        lessonId: data.lessonId,
        userId: data.userId,
        courseId: data.courseId,
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
      <div
        className={cn(
          "line-clamp-1",
          isActive ? "pointer-events-none" : "cursor-pointer"
        )}
        onClick={handleChangeLesson}
      >
        {title}
      </div>
    </>
  );

  if (url) return <div className={base}>{child}</div>;
  return <div className={base}>{child}</div>;
};

export default LessonItem;
