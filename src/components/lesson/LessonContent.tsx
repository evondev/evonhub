"use client";
import LessonItem from "@/components/course/LessonItem";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LessonContent = ({
  lectures,
  slug,
  lectureId,
}: {
  lectures: any[];
  slug: string;
  lectureId: string;
}) => {
  return (
    <div>
      {lectures.map((item) => (
        <Accordion
          type="single"
          collapsible
          className="w-full mb-5"
          key={item.title}
          defaultValue={lectureId}
        >
          <AccordionItem value={item.id}>
            <AccordionTrigger className="font-semibold dark:text-text5">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="bg-white dark:bg-grayDarker rounded-lg mt-5">
              {item.lessons.map((lesson: any) => (
                <LessonItem
                  key={lesson._id}
                  title={lesson.title}
                  url={lesson.slug}
                  isActive={lesson.slug === slug}
                  data={{
                    duration: lesson.duration,
                  }}
                ></LessonItem>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

export default LessonContent;
