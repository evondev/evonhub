import PageNotFound from "@/app/not-found";
import CourseDetailsPage from "@/components/pages/CourseDetailsPage";
import { updateCourseViews } from "@/lib/actions/course.action";
import { getCourseDetailsBySlug } from "@/lib/actions/general.action";
import { getLessonCount } from "@/lib/actions/lesson.action";
import { getRatingByCourse } from "@/lib/actions/rating.action";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";
import { Metadata, ResolvingMetadata } from "next";
export const maxDuration = 60;

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;

  const courseDetails = await getCourseDetailsBySlug(slug);

  return {
    title: courseDetails?.title,
    description: courseDetails?.desc,
    keywords: courseDetails?.seoKeywords,
    openGraph: {
      title: courseDetails?.title,
      description: courseDetails?.desc,
      images: [courseDetails?.image || "/cover.jpg"],
    },
  };
}
const page = async ({ params }: Props) => {
  const slug = params.slug;
  await updateCourseViews(slug);
  const courseDetails = await getCourseDetailsBySlug(slug);
  if (!courseDetails) return <PageNotFound />;
  const lessonCount = await getLessonCount(courseDetails._id);
  const ratings = await getRatingByCourse(courseDetails._id);
  const { userId } = auth();
  const mongoUser = await getUserById({ userId: userId || "" });
  return (
    <CourseDetailsPage
      data={JSON.parse(JSON.stringify(courseDetails))}
      lessonCount={lessonCount || 0}
      ratings={JSON.parse(JSON.stringify(ratings)) || []}
      user={mongoUser ? JSON.parse(JSON.stringify(mongoUser)) : {}}
    ></CourseDetailsPage>
  );
};

export default page;
