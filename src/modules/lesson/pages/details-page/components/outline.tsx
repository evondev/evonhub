"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LessonOutlineItem } from "@/modules/lesson/components";
import {
  useQueryLessonById,
  useQueryLessonDetailsOutline,
} from "@/modules/lesson/services";
import { useParams } from "next/navigation";
import { LoadingOutline } from "./loading-outline";

export interface LessonOutlineProps {}

export function LessonOutline(_props: LessonOutlineProps) {
  const params = useParams();
  const { data: lessonDetails } = useQueryLessonById({
    lessonId: params.id.toString(),
  });
  const { data: lectures, isFetching } = useQueryLessonDetailsOutline({
    slug: params.course.toString(),
  });
  if (isFetching) return <LoadingOutline />;
  if (!lessonDetails) return null;
  if (lectures?.length === 0 || !lectures) return null;
  return (
    <div className="p-3 h-[calc(100%-56px)] w-full lg:p-0 lg:h-auto overflow-y-auto lg:overflow-y-visible">
      <div className="flex-1 lg:overflow-visible h-full lg:h-auto w-full static lg:sticky top-10 xl:top-[112px] right-0">
        {lectures.map((item) => {
          const activeLesson = item.lessons.find(
            (el) => el._id.toString() === params.id.toString()
          );

          return (
            <Accordion
              type="single"
              collapsible
              className="w-full mb-3 lg:mb-5"
              key={item.title}
              defaultValue={activeLesson?.title || ""}
            >
              <AccordionItem value={activeLesson?.title || item.title}>
                <AccordionTrigger className="font-bold dark:text-text5 text-sm lg:text-base">
                  <div className="line-clamp-1 text-left">{item.title}</div>
                </AccordionTrigger>
                <AccordionContent className="bg-white dark:bg-grayDarker rounded-lg mt-3 lg:mt-5">
                  {item.lessons.map((lesson) => {
                    return (
                      <LessonOutlineItem
                        key={lesson._id}
                        title={lesson.title}
                        id={lesson._id}
                        isActive={
                          lesson._id.toString() === params.id.toString()
                        }
                        duration={lesson.duration}
                      ></LessonOutlineItem>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
      </div>
    </div>
  );
}
