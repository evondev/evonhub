"use client";
import { completeLesson } from "@/lib/actions/history.action";
import { cn } from "@/lib/utils";
import { formUrlQuery } from "@/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { IconPlay } from "../icons";
import { Checkbox } from "../ui/checkbox";

const LessonItem = ({
  title,
  url,
  isActive,
  isCompleted,
  data,
}: {
  title: string;
  url?: string;
  isActive?: boolean;
  isCompleted?: boolean;
  data: {
    userId: string;
    courseId: string;
    lessonId: string;
  };
}) => {
  const base = cn(
    "mb-5 pb-5 border-b border-dashed dark:border-b-slate-500 last:pb-0 last:mb-0 last:border-b-0 flex items-center gap-2 dark:text-text5 cursor-pointer text-sm",
    isActive ? "text-primary font-bold dark:text-primary" : "font-medium"
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleChangeLesson = () => {
    const newUrl = formUrlQuery({
      params: searchParams?.toString() || "",
      key: "slug",
      value: url || "",
    });
    router.push(newUrl);
  };
  const handleCompleteLesson = async (value: any) => {
    try {
      await completeLesson({
        lessonId: data.lessonId,
        userId: data.userId,
        courseId: data.courseId,
      });
    } catch (error) {
      console.log(error);
    }
  };
  const child = (
    <>
      <Checkbox
        defaultChecked={isCompleted}
        onCheckedChange={(checked) => handleCompleteLesson(checked)}
      />

      <IconPlay />
      <div className="line-clamp-1" onClick={handleChangeLesson}>
        {title}
      </div>
    </>
  );

  if (url) return <div className={base}>{child}</div>;
  return <div className={base}>{child}</div>;
};

export default LessonItem;
