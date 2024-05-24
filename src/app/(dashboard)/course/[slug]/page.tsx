import PageNotFound from "@/app/not-found";
import { updateCourseViews } from "@/lib/actions/course.action";
import { getCourseDetailsBySlug } from "@/lib/actions/general.action";
import { getLessonCount } from "@/lib/actions/lesson.action";
import CourseDetailsPage from "@/pages/CourseDetailsPage";
export const maxDuration = 60;

const page = async ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const slug = params.slug;
  await updateCourseViews(slug);
  const courseDetails = await getCourseDetailsBySlug(slug);
  if (!courseDetails) return <PageNotFound />;
  const lessonCount = await getLessonCount(courseDetails._id);
  return (
    <CourseDetailsPage
      data={JSON.parse(JSON.stringify(courseDetails))}
      lessonCount={lessonCount || 0}
    ></CourseDetailsPage>
  );
};

export default page;
