import EmptyData from "@/components/EmptyData";
import LessonPlayer from "@/components/course/LessonPlayer";
import {
  getAllLessonByCourseId,
  getLessonBySlug,
} from "@/lib/actions/lesson.action";

const page = async ({
  searchParams,
  params,
}: {
  params: {
    course: string;
  };
  searchParams: {
    slug: string;
  };
}) => {
  const lessonDetails = await getLessonBySlug(searchParams.slug, params.course);
  if (!lessonDetails) return <EmptyData text="Bài học không tồn tại!" />;
  const { video, title, content, courseId } = lessonDetails;
  const lessonList = (await getAllLessonByCourseId(courseId.toString())) || [];
  const lessonIndex = lessonList?.findIndex(
    (l) => l.slug === searchParams.slug
  );
  const nextLesson = lessonList[lessonIndex + 1]?.slug;
  const prevLesson = lessonList[lessonIndex - 1]?.slug;
  return (
    <LessonPlayer
      videoId={video}
      lessonDetails={{
        title,
        content,
      }}
      nextLesson={nextLesson}
      prevLesson={prevLesson}
    ></LessonPlayer>
  );
};

export default page;
