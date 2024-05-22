import PageNotFound from "@/app/not-found";
import CourseContent from "@/components/course/CourseContent";
import { getCourseUpdateOutline } from "@/lib/actions/admin.action";

const page = async ({
  searchParams,
}: {
  searchParams: {
    slug: string;
  };
}) => {
  const slug = searchParams.slug;
  const findCourse = await getCourseUpdateOutline(slug);
  if (!findCourse?.slug) return <PageNotFound></PageNotFound>;
  return (
    <CourseContent
      data={JSON.parse(JSON.stringify(findCourse))}
    ></CourseContent>
  );
};

export default page;
