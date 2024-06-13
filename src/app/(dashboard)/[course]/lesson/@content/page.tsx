import LessonItem from "@/components/course/LessonItem";
import LessonStudy from "@/components/lesson/LessonStudy";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getCompleteCourseHistory,
  getLessonDetailsContent,
} from "@/lib/actions/general.action";
import { getHistories } from "@/lib/actions/history.action";
import { getLessonBySlug } from "@/lib/actions/lesson.action";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";

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
  const { userId } = auth();
  const mongoUser = await getUserById({ userId: userId || "" });
  const lessonDetails = await getLessonBySlug(searchParams.slug, params.course);
  if (!lessonDetails) return null;
  const course = JSON.parse(JSON.stringify(lessonDetails.courseId));
  const progress =
    (await getCompleteCourseHistory({
      userId: mongoUser?._id.toString(),
      courseId: course._id.toString(),
    })) || 0;
  const courseId = course._id.toString();
  const historyLessons = await getHistories();
  const lectures = await getLessonDetailsContent({ courseSlug: params.course });
  if (!lectures) return null;
  return (
    <>
      <div className="hidden lg:flex items-center gap-3 mb-5">
        <div className="w-full p-0.5 border border-gray-200 dark:border-opacity-10 bg-white rounded-full dark:bg-grayDarker">
          <div
            className="h-2 gradient-primary rounded-full transition-all"
            style={{
              width: `${Math.ceil(progress)}%`,
            }}
          ></div>
        </div>
        <span className="font-bold flex-shrink-0 text-xs">
          {Math.ceil(progress)} %
        </span>
      </div>
      <LessonStudy content={lessonDetails.content}>
        {lectures.map((item) => (
          <Accordion
            type="single"
            collapsible
            className="w-full mb-3 lg:mb-5"
            key={item.title}
            defaultValue={lessonDetails.lectureId.toString()}
          >
            <AccordionItem value={item.id}>
              <AccordionTrigger className="font-bold dark:text-text5 text-sm lg:text-base">
                <div className="line-clamp-1 text-left">{item.title}</div>
              </AccordionTrigger>
              <AccordionContent className="bg-white dark:bg-grayDarker rounded-lg mt-3 lg:mt-5">
                {item.lessons.map((lesson) => {
                  return (
                    <LessonItem
                      key={lesson._id}
                      title={lesson.title}
                      url={lesson.slug}
                      isActive={lesson.slug === searchParams.slug}
                      isCompleted={
                        historyLessons?.findIndex(
                          (item) =>
                            item.lesson.toString() === lesson._id.toString() &&
                            item.user.toString() ===
                              mongoUser?._id.toString() &&
                            item.course.toString() === courseId
                        ) !== -1
                      }
                      path={`/${params.course}/lesson/${lesson.slug}`}
                      data={{
                        courseId: courseId.toString(),
                        lessonId: lesson._id.toString(),
                        userId: mongoUser?._id.toString(),
                        duration: lesson.duration,
                      }}
                    ></LessonItem>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </LessonStudy>
      <div className="hidden lg:block lg:max-h-[calc(100vh-175px-56px)] xl:max-h-[calc(100vh-175px)] lg:overflow-y-auto scroll-hidden rounded-lg">
        {lectures.map((item) => (
          <Accordion
            type="single"
            collapsible
            className="w-full mb-2 lg:mb-5"
            key={item.title}
            defaultValue={lessonDetails.lectureId.toString()}
          >
            <AccordionItem value={item.id}>
              <AccordionTrigger className="font-bold dark:text-text5 text-sm lg:text-base">
                <div className="line-clamp-1 text-left">{item.title}</div>
              </AccordionTrigger>
              <AccordionContent className="bg-white dark:bg-grayDarker rounded-lg mt-2 lg:mt-5">
                {item.lessons.map((lesson) => {
                  return (
                    <LessonItem
                      key={lesson._id}
                      title={lesson.title}
                      url={lesson.slug}
                      isActive={lesson.slug === searchParams.slug}
                      isCompleted={
                        historyLessons?.findIndex(
                          (item) =>
                            item.lesson.toString() === lesson._id.toString() &&
                            item.user.toString() ===
                              mongoUser?._id.toString() &&
                            item.course.toString() === courseId
                        ) !== -1
                      }
                      path={`/${params.course}/lesson/${lesson.slug}`}
                      data={{
                        courseId: courseId.toString(),
                        lessonId: lesson._id.toString(),
                        userId: mongoUser?._id.toString(),
                        duration: lesson.duration,
                      }}
                    ></LessonItem>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </>
  );
};

export default page;
