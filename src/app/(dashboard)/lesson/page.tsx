import PageNotFound from "@/app/not-found";
import EmptyData from "@/components/EmptyData";
import CommentForm from "@/components/comment/CommentForm";
import LessonItem from "@/components/course/LessonItem";
import LessonPlayer from "@/components/course/LessonPlayer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getAllComments } from "@/lib/actions/comment.action";
import { getCourseById } from "@/lib/actions/course.action";
import { getHistoriesByLessonId } from "@/lib/actions/history.action";
import { getLessonBySlug } from "@/lib/actions/lesson.action";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";

const page = async ({
  searchParams,
}: {
  searchParams: {
    slug: string;
  };
}) => {
  const { userId } = auth();
  if (!userId) return null;
  const mongoUser = await getUserById({ userId });
  if (!mongoUser || mongoUser.status !== "active") return <EmptyData />;
  const lessonDetails = await getLessonBySlug(searchParams.slug);
  if (!lessonDetails) return <PageNotFound />;
  const courseId = lessonDetails.courseId;
  const course = await getCourseById(courseId.toString());
  let videoId = lessonDetails.video;
  const lectures = course?.lecture || [];
  const allLessons = lectures.reduce((acc, item) => {
    return acc.concat(item.lessons);
  }, [] as any[]);
  const currentLessonIndex = allLessons.findIndex(
    (lesson) => lesson.slug === searchParams.slug
  );
  const nextLesson = allLessons[currentLessonIndex + 1]?.slug;
  const prevLesson = allLessons[currentLessonIndex - 1]?.slug;
  const comments = await getAllComments({
    lesson: lessonDetails._id.toString(),
    status: "approved",
  });
  const historyLessons = await getHistoriesByLessonId({
    lessonId: lessonDetails._id.toString(),
  });

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-8 items-start transition-all"
      id="lesson-study"
    >
      <div>
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
        <CommentForm
          userId={mongoUser._id.toString()}
          courseId={lessonDetails.courseId.toString()}
          comments={JSON.parse(JSON.stringify(comments))}
          lessonId={lessonDetails._id.toString()}
        ></CommentForm>
      </div>
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
              <AccordionTrigger className="font-semibold dark:text-text5 ">
                <div className="line-clamp-1">{item.title}</div>
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
                    isCompleted={historyLessons?.some(
                      (item) => item.lesson.toString() === lesson._id.toString()
                    )}
                    data={{
                      userId: mongoUser._id.toString(),
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
    </div>
  );
};

export default page;
