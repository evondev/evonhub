import { getUserById } from "@/lib/actions/user.action";
import { fetchHistoriesByUserId } from "@/modules/history/actions";
import { fetchLessonDetailsOutline } from "@/modules/lesson/actions";
import { fetchUserCoursesContinue } from "@/modules/user/actions";
import { UserItemData } from "@/shared/types/user.types";
import { StudyArea, StudyLoadError } from "../components";
import { STUDY_COURSE_FETCH_LIMIT } from "../constants";
import { StudyCourse } from "../types";
import {
  buildStudyOutline,
  findSelectedStudyCourse,
  getStudyCourseStatus,
  sortStudyCourses,
} from "../utils";

interface StudyAreaPageProps {
  clerkUserId: string;
  /** Slug khóa đang chọn, từ ?khoa= trên URL */
  selectedSlug?: string;
}

const getSelectHref = (slug: string) => `?khoa=${slug}`;

export async function StudyAreaPage({
  clerkUserId,
  selectedSlug,
}: StudyAreaPageProps) {
  const [user, continueData] = await Promise.all([
    getUserById({ userId: clerkUserId }) as Promise<
      UserItemData | null | undefined
    >,
    fetchUserCoursesContinue({
      userId: clerkUserId,
      limit: STUDY_COURSE_FETCH_LIMIT,
    }),
  ]);

  // Chưa có hồ sơ trong DB (webhook Clerk chưa đồng bộ): coi như chưa có khóa
  if (user === null)
    return <StudyArea courses={[]} getSelectHref={getSelectHref} />;

  if (!user || !continueData) return <StudyLoadError />;

  // Tiến độ đã tính gộp trong fetchUserCoursesContinue, cùng thứ tự với courses
  const studyCourses: StudyCourse[] = continueData.courses.map(
    (course, index) => {
      const courseProgress = continueData.progresses[index];
      const progress = Math.min(courseProgress.progress, 100);

      return {
        course,
        firstLesson: continueData.lessons[index] ?? undefined,
        progress,
        current: courseProgress.current,
        total: courseProgress.total,
        status: getStudyCourseStatus(courseProgress.current, progress),
      };
    },
  );
  const sortedCourses = sortStudyCourses(studyCourses);
  const selectedCourse = findSelectedStudyCourse(sortedCourses, selectedSlug);

  if (!selectedCourse) {
    return <StudyArea courses={[]} getSelectHref={getSelectHref} />;
  }

  const [lectures, histories] = await Promise.all([
    fetchLessonDetailsOutline(selectedCourse.course.slug),
    fetchHistoriesByUserId({
      userId: user._id.toString(),
      courseId: selectedCourse.course._id.toString(),
    }),
  ]);
  const completedLessonIds = (histories || []).map((history) =>
    history.lesson._id.toString(),
  );

  return (
    <StudyArea
      courses={sortedCourses}
      selectedCourse={selectedCourse}
      selectedOutline={buildStudyOutline(lectures || [], completedLessonIds)}
      getSelectHref={getSelectHref}
    />
  );
}
