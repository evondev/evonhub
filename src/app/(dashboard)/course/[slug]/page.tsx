import PageNotFound from "@/app/not-found";
import { getCourseBySlug } from "@/lib/actions/course.action";
import { getUserById } from "@/lib/actions/user.action";
import CourseDetailsPage from "@/pages/CourseDetailsPage";
import { ECourseStatus, Role } from "@/types/enums";
import { auth } from "@clerk/nextjs/server";

const page = async ({
  params,
}: {
  params: {
    slug: string;
  };
}) => {
  const slug = params.slug;
  const courseDetails = await getCourseBySlug(slug);
  const { userId } = auth();
  // if (!userId) redirect("/sign-in");
  const mongoUser = await getUserById({ userId: userId || "" });
  const role = mongoUser?.role;
  if (
    !courseDetails?.slug ||
    (courseDetails.status !== ECourseStatus.APPROVED && role !== Role.ADMIN)
  )
    return <PageNotFound />;
  return (
    <CourseDetailsPage
      data={JSON.parse(JSON.stringify(courseDetails))}
    ></CourseDetailsPage>
  );
};

export default page;
