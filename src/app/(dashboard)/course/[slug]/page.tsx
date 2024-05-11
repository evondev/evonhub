import PageNotFound from "@/app/not-found";
import {
  getCourseBySlug,
  udpateCourseViews,
} from "@/lib/actions/course.action";
import { getLessonCount } from "@/lib/actions/lesson.action";
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
  await udpateCourseViews(slug);
  const courseDetails = await getCourseBySlug(slug);
  const { userId } = auth();
  const mongoUser = await getUserById({ userId: userId || "" });
  const role = mongoUser?.role;
  if (
    !courseDetails?.slug ||
    (courseDetails.status !== ECourseStatus.APPROVED && role !== Role.ADMIN)
  )
    return <PageNotFound />;
  const lessonCount = await getLessonCount(courseDetails._id);
  return (
    <CourseDetailsPage
      data={JSON.parse(JSON.stringify(courseDetails))}
      lessonCount={lessonCount || 0}
    ></CourseDetailsPage>
  );
};

export default page;
