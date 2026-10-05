"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronRight } from "lucide-react";
import { StudyOutline } from "../types";
import { getDefaultOpenChapterKey, getLessonUrl } from "../utils";
import { StudyOutlineLesson } from "./study-outline-lesson";

interface StudyOutlineListProps {
  outline: StudyOutline;
  courseSlug: string;
}

/** Đề cương theo chương; mở sẵn chương có bài tiếp theo */
export function StudyOutlineList({
  outline,
  courseSlug,
}: StudyOutlineListProps) {
  const defaultOpenKey = getDefaultOpenChapterKey(outline);

  return (
    <AccordionPrimitive.Root
      type="multiple"
      defaultValue={defaultOpenKey ? [defaultOpenKey] : []}
    >
      {outline.chapters.map((chapter) => (
        <AccordionPrimitive.Item
          key={chapter.key}
          value={chapter.key}
          className="border-t border-border first:border-t-0"
        >
          <AccordionPrimitive.Header>
            <AccordionPrimitive.Trigger className="group flex h-12 w-full cursor-pointer items-center gap-2 px-4 text-left text-sm font-semibold text-foreground outline-none">
              <ChevronRight className="size-4 shrink-0 text-muted transition-transform duration-200 group-data-[state=open]:rotate-90 motion-reduce:transition-none" />
              <span className="min-w-0 flex-1 truncate">{chapter.title}</span>
              <span className="shrink-0 text-xs font-medium tabular-nums text-muted">
                {chapter.completedCount}/{chapter.lessons.length}
              </span>
            </AccordionPrimitive.Trigger>
          </AccordionPrimitive.Header>
          <AccordionPrimitive.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down motion-reduce:animate-none">
            <ul className="pb-2">
              {chapter.lessons.map((lesson) => (
                <StudyOutlineLesson
                  key={lesson.id}
                  lesson={lesson}
                  href={getLessonUrl(courseSlug, lesson.id)}
                />
              ))}
            </ul>
          </AccordionPrimitive.Content>
        </AccordionPrimitive.Item>
      ))}
    </AccordionPrimitive.Root>
  );
}
