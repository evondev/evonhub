import PageNotFound from "@/app/not-found";
import { getCourseBySlug } from "@/lib/actions/course.action";
import { getUserById } from "@/lib/actions/user.action";
import { CourseUpdatePage } from "@/modules/course/pages";
import { Role } from "@/types/enums";
import { auth } from "@clerk/nextjs/server";

interface CourseUpdateRouteProps {
  searchParams: {
    slug: string;
  };
}

const page = async ({ searchParams }: CourseUpdateRouteProps) => {
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
    <CourseUpdatePage
      data={JSON.parse(JSON.stringify(findCourse))}
      slug={searchParams.slug}
    />
  );
};

export default page;
