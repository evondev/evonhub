import { getCourseBySlug } from "@/lib/actions/course.action";
import CourseContent from "@/pages/admin/course/CourseContent";

const page = async ({
  searchParams,
}: {
  searchParams: {
    slug: string;
  };
}) => {
  const data = await getCourseBySlug(searchParams.slug);
  return (
    <CourseContent data={JSON.parse(JSON.stringify(data))}></CourseContent>
  );
};

export default page;
