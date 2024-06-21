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
  const { video, title, content, courseId, slug } = lessonDetails;
  const course = JSON.parse(JSON.stringify(courseId));
  const lessonList =
    (await getAllLessonByCourseId(course._id.toString())) || [];
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
        slug: searchParams.slug,
        course: course.slug,
        courseId: course._id.toString(),
      }}
      nextLesson={nextLesson}
      prevLesson={prevLesson}
    ></LessonPlayer>
  );
};

export default page;
