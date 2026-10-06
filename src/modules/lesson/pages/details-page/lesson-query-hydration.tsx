import { getCommentsByLessonOptions } from "@/modules/comment/services/data/query-comment-by-lesson";
import { getCourseBySlugOptions } from "@/modules/course/services/data/query-course-by-slug.data";
import { getHistoriesByUserOptions } from "@/modules/history/services/data/query-histories-by-user.data";
import { getLessonDetailsOutlineOptions } from "@/modules/lesson/services/data/query-lesson-outline.data";
import { getLessonsByCourseIdOptions } from "@/modules/lesson/services/data/query-lessons-by-course-id.data";
import { getQueryClient } from "@/shared/libs/react-query/query-client";
import { CourseItemData } from "@/shared/types/course.types";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface LessonQueryHydrationProps {
  children: React.ReactNode;
  course: CourseItemData;
  lessonId: string;
  userId: string;
}

/**
 * Đổ sẵn vào cache React Query những gì trang học đọc ở client (khóa, danh sách
 * bài, mục lục, lịch sử học, bình luận). Không có bước này, sau khi hydrate trang
 * gọi lần lượt từng server action (Next chạy chúng nối đuôi nhau).
 */
export async function LessonQueryHydration({
  children,
  course,
  lessonId,
  userId,
}: LessonQueryHydrationProps) {
  const queryClient = getQueryClient();
  const courseId = course._id.toString();

  // Khóa đã đọc ở page: đặt thẳng vào cache, không query lại
  queryClient.setQueryData(
    getCourseBySlugOptions({ courseSlug: course.slug }).queryKey,
    course,
  );

  await Promise.all([
    queryClient.prefetchQuery(getLessonsByCourseIdOptions({ courseId })),
    queryClient.prefetchQuery(
      getLessonDetailsOutlineOptions({ slug: course.slug }),
    ),
    queryClient.prefetchQuery(getHistoriesByUserOptions({ userId, courseId })),
    queryClient.prefetchQuery(getCommentsByLessonOptions({ lessonId })),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
