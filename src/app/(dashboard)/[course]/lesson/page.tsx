import PageNotFound from "@/app/not-found";
import { getUserById } from "@/lib/actions/user.action";
import { fetchCourseBySlug } from "@/modules/course/actions";
import { getLessonById } from "@/modules/lesson/actions";
import {
  DetailsPageLayout,
  LessonDetailsPage,
  LessonQueryHydration,
} from "@/modules/lesson/pages";
import { LessonItemCutomizeData } from "@/shared/types";
import { CourseItemData } from "@/shared/types/course.types";
import { UserItemData } from "@/shared/types/user.types";
import { auth } from "@clerk/nextjs/server";

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
  // getLessonById tự cắt nội dung trả phí nếu chưa có quyền, nên chạy song song
  // với phần kiểm tra sở hữu thay vì đợi kiểm tra xong mới đọc bài
  const [mongoUser, courseDetails, lessonDetails] = (await Promise.all([
    getUserById({ userId: userId || "" }),
    // Không lọc theo trạng thái: khóa ngừng bán vẫn học được, quyền vào học do
    // việc đã sở hữu khóa quyết định chứ không phải trạng thái bán
    fetchCourseBySlug(courseSlug),
    getLessonById(lessonId),
  ])) as [UserItemData, CourseItemData, LessonItemCutomizeData | undefined];

  const userCourseIds =
    mongoUser?.courses.map((course) => course._id.toString()) || [];

  const courseId = courseDetails?._id?.toString() || "";
  const isPreviewLesson = lessonDetails?.trial === true;

  const isOwnedCourse = userCourseIds.includes(courseId) && !!lessonDetails;

  if (!isOwnedCourse) return <PageNotFound />;

  return (
    <LessonQueryHydration
      course={courseDetails}
      lessonId={lessonId}
      userId={mongoUser._id.toString()}
    >
      <DetailsPageLayout>
        <LessonDetailsPage
          lessonDetails={lessonDetails}
          lessonId={lessonId}
          isPreviewLesson={isPreviewLesson && !isOwnedCourse}
        />
      </DetailsPageLayout>
    </LessonQueryHydration>
  );
}
