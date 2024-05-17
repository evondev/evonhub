import PageNotFound from "@/app/not-found";
import UpdateCourseForm from "@/components/forms/UpdateCourseForm";
import { getCourseBySlug } from "@/lib/actions/course.action";
import { auth } from "@clerk/nextjs/server";

const page = async ({
  searchParams,
}: {
  searchParams: {
    slug: string;
  };
}) => {
  const { userId } = auth();
  const slug = searchParams.slug;
  const findCourse = await getCourseBySlug(slug, userId || "");
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
