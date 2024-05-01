import { getCourseBySlug } from "@/lib/actions/course.action";
import CourseDetailsPage from "@/pages/CourseDetailsPage";

const page = async ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const slug = params.slug;
  const courseDetails = await getCourseBySlug(slug);
  return (
    <CourseDetailsPage
      data={JSON.parse(JSON.stringify(courseDetails))}
    ></CourseDetailsPage>
  );
};

export default page;
