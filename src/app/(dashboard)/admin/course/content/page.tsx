import PageNotFound from "@/app/not-found";
import CourseContent from "@/components/course/CourseContent";
import { getCourseBySlug } from "@/lib/actions/course.action";

const page = async ({
  searchParams,
}: {
  searchParams: {
    slug: string;
  };
}) => {
  const slug = searchParams.slug;
  const findCourse = await getCourseBySlug(slug);
  if (!findCourse?.title) return <PageNotFound></PageNotFound>;
  return (
    <CourseContent
      data={JSON.parse(JSON.stringify(findCourse))}
    ></CourseContent>
  );
};

export default page;
