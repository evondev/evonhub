import { NotFoundState } from "@/shared/components/not-found";
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
    // việc đã sở hữu khóa quyết định chứ không phải trạng thái bán. Riêng khóa
    // lưu trữ trả về undefined với người không quản lý khóa nên rơi xuống NotFoundState
    fetchCourseBySlug(courseSlug),
    getLessonById(lessonId),
  ])) as [
    UserItemData | undefined,
    CourseItemData,
    LessonItemCutomizeData | undefined,
  ];

  const userCourseIds =
    mongoUser?.courses.map((course) => course._id.toString()) || [];

  const courseId = courseDetails?._id?.toString() || "";
  const lessonCourseId = lessonDetails?.courseId?._id?.toString() || "";
  const isLessonInCourse =
    !!lessonDetails &&
    !!courseId &&
    lessonCourseId === courseId &&
    !lessonDetails._destroy;

  const isOwnedCourse = isLessonInCourse && userCourseIds.includes(courseId);
  // Bài học thử mở cho mọi người, kể cả chưa đăng nhập. getLessonById chỉ trả
  // video, nội dung của bài trial cho người chưa mua, nên không lộ bài khác
  const isPreviewLesson =
    isLessonInCourse && !isOwnedCourse && lessonDetails?.trial === true;

  if (!isOwnedCourse && !isPreviewLesson) return <NotFoundState />;

  return (
    <LessonQueryHydration
      course={courseDetails}
      lessonId={lessonId}
      userId={mongoUser?._id?.toString() || ""}
    >
      <DetailsPageLayout>
        <LessonDetailsPage
          lessonDetails={lessonDetails}
          lessonId={lessonId}
          isPreviewLesson={isPreviewLesson}
        />
      </DetailsPageLayout>
    </LessonQueryHydration>
  );
}
