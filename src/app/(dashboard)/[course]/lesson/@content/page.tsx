import LessonItem from "@/components/course/LessonItem";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getLessonDetailsContent } from "@/lib/actions/general.action";
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
  const courseId = lessonDetails.courseId.toString();
  const historyLessons = await getHistories();
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
            <AccordionTrigger className="font-bold dark:text-text5 text-sm lg:text-base">
              <div className="line-clamp-1 text-left">{item.title}</div>
            </AccordionTrigger>
            <AccordionContent className="bg-white dark:bg-grayDarker rounded-lg mt-5">
              {item.lessons.map((lesson) => {
                return (
                  <LessonItem
                    key={lesson._id}
                    title={lesson.title}
                    url={
                      lesson.slug === searchParams.slug
                        ? undefined
                        : lesson.slug
                    }
                    isActive={lesson.slug === searchParams.slug}
                    isCompleted={
                      historyLessons?.findIndex(
                        (item) =>
                          item.lesson.toString() === lesson._id.toString() &&
                          item.user.toString() === mongoUser?._id.toString() &&
                          item.course.toString() === courseId
                      ) !== -1
                    }
                    data={{
                      courseId: courseId.toString(),
                      lessonId: lesson._id.toString(),
                      userId: mongoUser?._id.toString(),
                    }}
                  ></LessonItem>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

export default page;
