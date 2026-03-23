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
  const findCourse = await getCourseBySlug(searchParams.slug);
  if (
    findCourse?.author?.toString() !== mongoUser._id.toString() &&
    ![Role.ADMIN].includes(mongoUser?.role)
  )
    return <PageNotFound></PageNotFound>;
  if (!findCourse?.title) return <PageNotFound></PageNotFound>;
  return (
    <>
      <UpdateCourseForm
        data={JSON.parse(JSON.stringify(findCourse))}
        slug={searchParams.slug}
      ></UpdateCourseForm>
    </>
  );
};

export default page;
