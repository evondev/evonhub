import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LessonDetailsOutlineData } from "@/shared/types";
import { HistoryItemData } from "@/shared/types/history.types";
import { LessonOutlineItem } from "./lesson-outline-item";

export interface CourseOutlineProps {
  lectures: LessonDetailsOutlineData[];
  lessonId?: string;
  courseId: string;
  histories?: HistoryItemData[];
  userId?: string;
  isExpandedAll?: boolean;
  courseSlug?: string;
}

export function CourseOutline({
  lectures = [],
  lessonId = "",
  courseId = "",
  histories = [],
  userId = "",
  isExpandedAll = false,
  courseSlug = "",
}: CourseOutlineProps) {
  return (
    <>
      {lectures.map((item, index) => {
        const activeLesson = item.lessons.find(
          (el) => el._id.toString() === lessonId
        );

        return (
          <Accordion
            type="single"
            collapsible
            className="w-full mb-3 lg:mb-5"
            key={item.title}
            defaultValue={
              isExpandedAll && index === 0
                ? item.title
                : activeLesson?.lectureId?.title || ""
            }
          >
            <AccordionItem value={item.title || ""}>
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
                      isActive={lesson._id.toString() === lessonId}
                      duration={lesson.duration}
                      courseId={courseId}
                      histories={histories}
                      userId={userId}
                      isPreview={lesson.trial}
                      course={courseSlug}
                    ></LessonOutlineItem>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      })}
    </>
  );
}
