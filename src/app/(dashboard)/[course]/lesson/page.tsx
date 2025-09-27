import PageNotFound from "@/app/not-found";
import { getUserById } from "@/lib/actions/user.action";
import { fetchCourseBySlug } from "@/modules/course/actions";
import { getLessonById, getLessonPreview } from "@/modules/lesson/actions";
import { DetailsPageLayout, LessonDetailsPage } from "@/modules/lesson/pages";
import { CourseStatus } from "@/shared/constants/course.constants";
import { LessonItemCutomizeData } from "@/shared/types";
import { CourseItemData } from "@/shared/types/course.types";
import { UserItemData } from "@/shared/types/user.types";
import { handleCheckMembership } from "@/shared/utils";
import { auth } from "@clerk/nextjs/server";

export interface LessonNewPageProps {
  searchParams: {
    id: string;
    slug: string;
  };
  params: {
    course: string;
  };
}

export default async function LessonNewPage({
  searchParams,
  params,
}: LessonNewPageProps) {
  const lessonId = searchParams.id;
  const lessonSlug = searchParams.slug;
  const courseSlug = params.course;

  const { userId } = auth();
  const [mongoUser, courseDetails, lessonPreview] = (await Promise.all([
    getUserById({ userId: userId || "" }),
    fetchCourseBySlug(courseSlug, CourseStatus.Approved),
    getLessonPreview(lessonId),
  ])) as [UserItemData, CourseItemData, LessonItemCutomizeData];

  const userCourseIds =
    mongoUser?.courses.map((course) => course._id.toString()) || [];

  const courseId = courseDetails?._id?.toString() || "";
  const isPreviewLesson = lessonPreview?.trial === true;

  const isMembershipActive = handleCheckMembership({
    isMembership: mongoUser?.isMembership,
    endDate: mongoUser?.planEndDate || new Date().toISOString(),
  });

  const isOwnedCourse =
    (userCourseIds.includes(courseId) ||
      isMembershipActive ||
      isPreviewLesson) &&
    !!lessonPreview;

  if (!isOwnedCourse) return <PageNotFound />;

  const lessonDetails = await getLessonById(lessonId);

  return (
    <DetailsPageLayout>
      <LessonDetailsPage
        lessonDetails={lessonDetails}
        lessonId={lessonId}
        isPreviewLesson={isPreviewLesson}
      />
    </DetailsPageLayout>
  );
}
