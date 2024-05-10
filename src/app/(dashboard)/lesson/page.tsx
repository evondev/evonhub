import PageNotFound from "@/app/not-found";
import LessonItem from "@/components/course/LessonItem";
import LessonPlayer from "@/components/course/LessonPlayer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getCourseById } from "@/lib/actions/course.action";
import { getLessonBySlug } from "@/lib/actions/lesson.action";

const page = async ({
  searchParams,
}: {
  searchParams: {
    slug: string;
  };
}) => {
  const lessonDetails = await getLessonBySlug(searchParams.slug);
  if (!lessonDetails) return <PageNotFound />;
  const courseId = lessonDetails.courseId;
  const course = await getCourseById(courseId.toString());
  let videoId = lessonDetails.video.includes("?v=")
    ? lessonDetails.video.split("?v=").at(-1)
    : lessonDetails.video.split("/").at(-1);
  const lectures = course?.lecture || [];
  const allLessons = lectures.reduce((acc, item) => {
    return acc.concat(item.lessons);
  }, [] as any[]);
  const currentLessonIndex = allLessons.findIndex(
    (lesson) => lesson.slug === searchParams.slug
  );
  const nextLesson = allLessons[currentLessonIndex + 1]?.slug;
  const prevLesson = allLessons[currentLessonIndex - 1]?.slug;
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-5 items-start transition-all"
      id="lesson-study"
    >
      <LessonPlayer
        videoId={videoId || ""}
        video={lessonDetails.video}
        lessonDetails={{
          title: lessonDetails.title,
          content: lessonDetails.content,
        }}
        nextLesson={nextLesson}
        prevLesson={prevLesson}
      ></LessonPlayer>
      <div id="lesson-content-aside">
        {lectures.map((item) => (
          <Accordion
            type="single"
            collapsible
            className="w-full mb-5"
            key={item.title}
            defaultValue={lessonDetails.lectureId.toString()}
          >
            <AccordionItem value={item.id}>
              <AccordionTrigger className="font-semibold dark:text-text5">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="bg-white dark:bg-grayDarker rounded-lg mt-5">
                {item.lessons.map((lesson) => (
                  <LessonItem
                    key={lesson._id}
                    title={lesson.title}
                    url={
                      lesson.slug === searchParams.slug
                        ? undefined
                        : lesson.slug
                    }
                    isActive={lesson.slug === searchParams.slug}
                  ></LessonItem>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default page;