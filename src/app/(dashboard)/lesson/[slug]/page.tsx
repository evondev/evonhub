import PageNotFound from "@/app/not-found";
import LessonItem from "@/components/course/LessonItem";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getCourseById } from "@/lib/actions/course.action";
import { getLessonBySlug } from "@/lib/actions/lesson.action";

const page = async ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const lessonDetails = await getLessonBySlug(params.slug);
  if (!lessonDetails) return <PageNotFound />;
  const courseId = lessonDetails.courseId;
  const course = await getCourseById(courseId.toString());
  let videoId = lessonDetails.video.includes("?v=")
    ? lessonDetails.video.split("?v=").at(-1)
    : lessonDetails.video.split("/").at(-1);
  const lectures = course?.lecture || [];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-5 items-start">
      <div>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="w-full h-full object-cover rounded-lg aspect-video mb-5"
        ></iframe>
        <h1 className="font-bold text-2xl mb-5">{lessonDetails.title}</h1>
        <div className="lesson-content">{lessonDetails.content}</div>
      </div>
      <div>
        {lectures.map((item) => (
          <Accordion
            type="single"
            collapsible
            className="w-full mb-5"
            key={item.title}
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-semibold dark:text-text5">
                {item.title}
              </AccordionTrigger>
              <AccordionContent className="bg-white dark:bg-grayDarker rounded-lg mt-5">
                {item.lessons.map((lesson) => (
                  <LessonItem
                    key={lesson._id}
                    title={lesson.title}
                    url={lesson.slug === params.slug ? undefined : lesson.slug}
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
