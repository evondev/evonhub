import LessonItem from "@/components/course/LessonItem";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getLessonDetailsContent } from "@/lib/actions/general.action";
import { getHistoriesByLessonId } from "@/lib/actions/history.action";
import { getLessonBySlug } from "@/lib/actions/lesson.action";

const page = async ({
  params,
  searchParams,
}: {
  params: {
    course: string;
  };
  searchParams: {
    slug: string;
  };
}) => {
  const lessonDetails = await getLessonBySlug(searchParams.slug, params.course);
  if (!lessonDetails) return null;
  const courseId = lessonDetails.courseId.toString();
  const historyLessons = await getHistoriesByLessonId({
    lessonId: lessonDetails._id.toString(),
  });
  const lectures = await getLessonDetailsContent({ courseSlug: params.course });
  if (!lectures) return null;
  return (
    <div>
      {lectures.map((item) => (
        <Accordion
          type="single"
          collapsible
          className="w-full mb-5"
          key={item.title}
          defaultValue={lessonDetails.lectureId.toString()}
        >
          <AccordionItem value={item.id}>
            <AccordionTrigger className="font-bold dark:text-text5 ">
              <div className="line-clamp-1">{item.title}</div>
            </AccordionTrigger>
            <AccordionContent className="bg-white dark:bg-grayDarker rounded-lg mt-5">
              {item.lessons.map((lesson) => (
                <LessonItem
                  key={lesson._id}
                  title={lesson.title}
                  url={
                    lesson.slug === searchParams.slug ? undefined : lesson.slug
                  }
                  isActive={lesson.slug === searchParams.slug}
                  isCompleted={historyLessons?.some(
                    (item) => item.lesson.toString() === lesson._id.toString()
                  )}
                  data={{
                    courseId: courseId.toString(),
                    lessonId: lesson._id.toString(),
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

export default page;
