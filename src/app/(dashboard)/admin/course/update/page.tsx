import PageNotFound from "@/app/not-found";
import UpdateCourseForm from "@/components/forms/UpdateCourseForm";
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
    <>
      <UpdateCourseForm
        data={JSON.parse(JSON.stringify(findCourse))}
        slug={slug}
      ></UpdateCourseForm>
    </>
  );
};

export default page;
