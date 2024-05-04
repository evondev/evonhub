import PageNotFound from "@/app/not-found";
import { getCourseBySlug } from "@/lib/actions/course.action";
import CourseDetailsPage from "@/pages/CourseDetailsPage";
import { ECourseStatus } from "@/types/enums";

const page = async ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const slug = params.slug;
  const courseDetails = await getCourseBySlug(slug);
  if (!courseDetails?.slug || courseDetails.status !== ECourseStatus.APPROVED)
    return <PageNotFound />;
  return (
    <CourseDetailsPage
      data={JSON.parse(JSON.stringify(courseDetails))}
    ></CourseDetailsPage>
  );
};

export default page;
