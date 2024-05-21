import RatingForm from "@/components/rating/RatingForm";
import { getLessonBySlug } from "@/lib/actions/lesson.action";

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
  const courseId = lessonDetails?.courseId.toString() || "";
  if (!lessonDetails) return null;

  return <RatingForm courseId={courseId}></RatingForm>;
};

export default page;
