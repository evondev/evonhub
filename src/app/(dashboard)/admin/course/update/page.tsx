import PageNotFound from "@/app/not-found";
import UpdateCourseForm from "@/components/forms/UpdateCourseForm";
import { getCourseBySlug } from "@/lib/actions/course.action";
import { getUserById } from "@/lib/actions/user.action";
import { Role } from "@/types/enums";
import { auth } from "@clerk/nextjs/server";

const page = async ({
  searchParams,
}: {
  searchParams: {
    slug: string;
  };
}) => {
  const { userId } = auth();
  const mongoUser = await getUserById({ userId: userId || "" });
  const course = await getCourseBySlug(searchParams.slug);
  if (
    course?.author?.toString() !== mongoUser._id.toString() &&
    ![Role.ADMIN].includes(mongoUser?.role)
  )
    return <PageNotFound></PageNotFound>;
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
