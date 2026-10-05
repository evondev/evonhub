import { formatDurationMinutes, sumLessonMinutes } from "@/modules/course/utils";
import { LessonDetailsOutlineData } from "@/shared/types";
import { HistoryItemData } from "@/shared/types/history.types";
import { cn } from "@/shared/utils";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { OutlineLessonRow } from "./outline-lesson-row";

export interface OutlineChapterListProps {
  lectures: LessonDetailsOutlineData[];
  lessonId: string;
  courseId: string;
  histories?: HistoryItemData[];
  userId: string;
  // panel: cột phải desktop, lề 20px. tab: trong tab Mục lục ở mobile, lề 16px
  variant: "panel" | "tab";
}

// Dùng thẳng Radix: AccordionTrigger dùng chung có sẵn khung viền
// (borderDarkMode nằm ở layer utilities nên không ghi đè được), mỗi chương
// thành một hộp riêng. Ở đây các chương chỉ chia nhau bằng một đường tóc.
export function OutlineChapterList({
  lectures,
  lessonId,
  courseId,
  histories = [],
  userId,
  variant,
}: OutlineChapterListProps) {
  const completedLessonIds = new Set(
    histories.map((history) => history.lesson._id.toString()),
  );
  const activeChapter = lectures.find((lecture) =>
    lecture.lessons.some((lesson) => lesson._id.toString() === lessonId),
  );
  const isTab = variant === "tab";

  return (
    <AccordionPrimitive.Root
      type="multiple"
      defaultValue={activeChapter ? [activeChapter.title] : []}
      className="divide-y divide-border border-t border-border"
    >
      {lectures.map((lecture) => {
        const doneCount = lecture.lessons.filter((lesson) =>
          completedLessonIds.has(lesson._id.toString()),
        ).length;
        const totalMinutes = sumLessonMinutes(lecture.lessons);
        const meta = `${doneCount} / ${lecture.lessons.length} bài · ${formatDurationMinutes(totalMinutes)}`;

        return (
          <AccordionPrimitive.Item
            key={lecture.id || lecture.title}
            value={lecture.title}
          >
            <AccordionPrimitive.Header>
              <AccordionPrimitive.Trigger
                className={cn(
                  "group flex w-full cursor-pointer items-start gap-3 py-4 text-left outline-none",
                  isTab && "px-4",
                  !isTab && "px-5",
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-pretty text-sm font-medium text-foreground">
                    {lecture.title}
                  </span>
                  <span className="mt-1 block text-xs tabular-nums text-muted">
                    {meta}
                  </span>
                </span>
                <ChevronDown className="mt-0.5 size-4 shrink-0 text-muted transition-[rotate,color] duration-200 group-hover:text-foreground group-data-[state=open]:rotate-180 motion-reduce:transition-none" />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down motion-reduce:animate-none">
              <ul
                className={cn(
                  "space-y-0.5 pb-3",
                  isTab && "px-1",
                  !isTab && "px-2",
                )}
              >
                {lecture.lessons.map((lesson) => (
                  <OutlineLessonRow
                    key={lesson._id.toString()}
                    id={lesson._id.toString()}
                    title={lesson.title}
                    duration={lesson.duration}
                    isActive={lesson._id.toString() === lessonId}
                    courseId={courseId}
                    histories={histories}
                    userId={userId}
                  />
                ))}
              </ul>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        );
      })}
    </AccordionPrimitive.Root>
  );
}
