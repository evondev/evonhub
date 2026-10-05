import { formatChapterSummary } from "@/modules/course/utils";
import { LessonDetailsOutlineData } from "@/shared/types";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import CourseCurriculumLesson from "./course-curriculum-lesson";

export interface CourseCurriculumChapterProps {
  value: string;
  lecture: LessonDetailsOutlineData;
  courseSlug: string;
  isOwned: boolean;
}

export default function CourseCurriculumChapter({
  value,
  lecture,
  courseSlug,
  isOwned,
}: CourseCurriculumChapterProps) {
  return (
    <AccordionPrimitive.Item value={value}>
      <AccordionPrimitive.Header asChild>
        <h3>
          <AccordionPrimitive.Trigger className="group flex w-full cursor-pointer items-center gap-4 px-4 py-4 text-left outline-none sm:px-5">
            <span className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <span className="text-pretty text-sm font-medium text-foreground">
                {lecture.title}
              </span>
              <span className="shrink-0 text-sm tabular-nums text-muted">
                {formatChapterSummary(lecture.lessons)}
              </span>
            </span>
            <ChevronDown
              className="size-4 shrink-0 text-muted transition-[transform,color] duration-200 group-hover:text-foreground group-data-[state=open]:rotate-180 motion-reduce:transition-none"
              aria-hidden
            />
          </AccordionPrimitive.Trigger>
        </h3>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down motion-reduce:animate-none">
        <ul className="px-4 pb-3 sm:px-5">
          {lecture.lessons.map((lesson) => (
            <CourseCurriculumLesson
              key={lesson._id}
              id={lesson._id}
              title={lesson.title}
              duration={lesson.duration}
              courseSlug={courseSlug}
              shouldShowTrial={lesson.trial && !isOwned}
            />
          ))}
        </ul>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}
