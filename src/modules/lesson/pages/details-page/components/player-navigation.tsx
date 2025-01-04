"use client";
import { getLessonById } from "@/modules/lesson/actions";
import { IconLongArrowLeft, IconLongArrowRight } from "@/shared/components";
import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { getQueryClient } from "@/shared/libs";
import { cn } from "@/shared/utils";
import { useRouter } from "next/navigation";

export interface PlayerNavigationProps {
  action: "prev" | "next";
  lessonId: string;
}

export function PlayerNavigation({ action, lessonId }: PlayerNavigationProps) {
  const queryClient = getQueryClient();
  const router = useRouter();
  const handleMouseEnter = (lessonId: string) => {
    queryClient.prefetchQuery({
      queryKey: [QUERY_KEYS.GET_LESSON_BY_ID, lessonId],
      queryFn: () => getLessonById(lessonId),
    });
  };
  const handleChangeLesson = () => {
    if (!lessonId) return;
    router.push(lessonId, {
      scroll: false,
    });
  };
  return (
    <button
      type="button"
      onMouseEnter={() => handleMouseEnter(lessonId)}
      onClick={handleChangeLesson}
      className={cn(
        "flex opacity-0 invisible group-hover:opacity-100 group-hover:visible size-10 rounded items-center bg-white justify-center absolute top-1/2 -translate-y-1/2 z-10 hover:!bg-primary hover:!text-white transition-all dark:bg-grayDarker",
        action === "prev" ? "left-5" : "right-5"
      )}
    >
      {action === "next" ? <IconLongArrowRight /> : <IconLongArrowLeft />}
    </button>
  );
}
