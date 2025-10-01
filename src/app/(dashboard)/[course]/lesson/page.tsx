import PageNotFound from "@/app/not-found";
import { getUserById } from "@/lib/actions/user.action";
import { fetchCourseBySlug } from "@/modules/course/actions";
import { getLessonById, getLessonPreview } from "@/modules/lesson/actions";
import { DetailsPageLayout, LessonDetailsPage } from "@/modules/lesson/pages";
import { CourseStatus } from "@/shared/constants/course.constants";
import { QUERY_KEYS } from "@/shared/constants/react-query.constants";
import { LessonItemCutomizeData } from "@/shared/types";
import { CourseItemData } from "@/shared/types/course.types";
import { UserItemData } from "@/shared/types/user.types";
import { handleCheckMembership } from "@/shared/utils";
import { auth } from "@clerk/nextjs/server";
import { unstable_cache } from "next/cache";

export interface LessonNewPageProps {
  searchParams: {
    id: string;
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
  const courseSlug = params.course;

  const { userId } = auth();

  const getCachedGetUserById = unstable_cache(
    getUserById,
    [QUERY_KEYS.GET_USER_BY_ID, `${userId}`],
    { revalidate: 1800 }
  );
  const getCachedFetchCourseBySlug = unstable_cache(
    fetchCourseBySlug,
    [QUERY_KEYS.FETCH_COURSE_BY_SLUG, `${courseSlug}`, CourseStatus.Approved],
    { revalidate: 1800 }
  );
  const getCachedGetLessonPreview = unstable_cache(
    getLessonPreview,
    [QUERY_KEYS.GET_LESSON_PREVIEW, lessonId],
    { revalidate: 1800 }
  );

  const [mongoUser, courseDetails, lessonPreview] = (await Promise.all([
    getCachedGetUserById({ userId: userId || "" }),
    getCachedFetchCourseBySlug(courseSlug, CourseStatus.Approved),
    getCachedGetLessonPreview(lessonId),
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
    (userCourseIds.includes(courseId) || isMembershipActive) && !!lessonPreview;

  if (!isOwnedCourse) return <PageNotFound />;
  const getCachedLessonById = unstable_cache(
    getLessonById,
    [QUERY_KEYS.GET_LESSON_BY_ID, lessonId],
    { revalidate: 1800 }
  );

  const lessonDetails = await getCachedLessonById(lessonId);

  return (
    <DetailsPageLayout>
      <LessonDetailsPage
        lessonDetails={lessonDetails}
        lessonId={lessonId}
        isPreviewLesson={isPreviewLesson && !isOwnedCourse}
      />
    </DetailsPageLayout>
  );
}
