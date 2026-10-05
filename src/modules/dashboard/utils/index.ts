import { CourseItemData } from "@/modules/course/types";
import { Award, BookOpen, CircleCheck, Flame } from "lucide-react";
import { PREVIEW_COURSE_PROGRESS } from "../constants";
import {
  DashboardCourseProgress,
  DashboardLessonLink,
  LearningActivity,
  LearningStatTile,
  WeeklyLessonCount,
} from "../types";

const EMPTY_STAT_VALUE = "—";
const EMPTY_STAT_NOTE = "Chưa có số liệu";

/** Tên tiếng Việt gọi bằng chữ cuối: "Trần Anh Tuấn" → "Tuấn" */
export function getFirstName(fullName?: string) {
  const nameParts = (fullName || "").trim().split(/\s+/);

  return nameParts[nameParts.length - 1] || "";
}

export function getLessonFallbackUrl(
  slug: string,
  lesson?: DashboardLessonLink,
) {
  return `/${slug}/lesson?id=${lesson?._id || ""}`;
}

interface BuildStatTilesParams {
  inProgressCourses: DashboardCourseProgress[];
  completedCourses: DashboardCourseProgress[];
  learningActivity?: LearningActivity;
}

export function buildStatTiles({
  inProgressCourses,
  completedCourses,
  learningActivity,
}: BuildStatTilesParams): LearningStatTile[] {
  const notStartedCount = inProgressCourses.filter(
    (courseProgress) => courseProgress.current === 0,
  ).length;
  const remainingLessons = inProgressCourses.reduce(
    (total, courseProgress) =>
      total + Math.max(courseProgress.total - courseProgress.current, 0),
    0,
  );

  return [
    {
      label: "Bài xong 7 ngày qua",
      value: learningActivity
        ? String(learningActivity.lessonsLastSevenDays)
        : EMPTY_STAT_VALUE,
      note: learningActivity
        ? `${learningActivity.lessonsToday} bài hôm nay`
        : EMPTY_STAT_NOTE,
      icon: CircleCheck,
    },
    {
      label: "Chuỗi ngày học",
      value: learningActivity
        ? `${learningActivity.currentStreakDays} ngày`
        : EMPTY_STAT_VALUE,
      note: learningActivity
        ? `Dài nhất ${learningActivity.longestStreakDays} ngày`
        : EMPTY_STAT_NOTE,
      icon: Flame,
    },
    {
      label: "Khóa đang học",
      value: String(inProgressCourses.length),
      note:
        notStartedCount > 0
          ? `${notStartedCount} khóa chưa bắt đầu`
          : `Còn ${remainingLessons} bài`,
      icon: BookOpen,
    },
    {
      label: "Khóa đã hoàn thành",
      value: String(completedCourses.length),
      note: completedCourses[0]?.course.title || "Chưa có khóa nào",
      icon: Award,
    },
  ];
}

/** Nhãn trục cách một cột, đếm ngược từ cột cuối, cho khỏi dính nhau ở khung hẹp */
export function getWeekAxisLabel(
  week: WeeklyLessonCount,
  index: number,
  weekCount: number,
) {
  if ((weekCount - 1 - index) % 2 !== 0) return "";

  return week.isCurrent ? "Nay" : week.label;
}

/** Gắn tiến độ mẫu vào khóa thật cho trang xem trước ở dev */
export function buildPreviewCoursesProgress(
  courses: CourseItemData[],
): DashboardCourseProgress[] {
  return courses
    .slice(0, PREVIEW_COURSE_PROGRESS.length)
    .map((course, index) => {
      const { current, total } = PREVIEW_COURSE_PROGRESS[index];

      return {
        // Khóa thứ ba bỏ ảnh để xem ô thay thế khi khóa chưa có ảnh
        course: index === 2 ? { ...course, image: "" } : course,
        lesson: { _id: "", slug: "" },
        progress: Math.round((current / total) * 100),
        current,
        total,
      };
    });
}

/**
 * firstName undefined: khách chưa đăng nhập. Chuỗi rỗng: đã đăng nhập nhưng
 * không biết tên, vẫn là người mới.
 */
export function getWelcomeHeading(firstName?: string) {
  if (firstName === undefined) {
    return "AI viết code giúp bạn. Nhưng hậu quả thì bạn chịu";
  }

  if (!firstName) return "Chọn khóa đầu tiên để bắt đầu";

  return `Chào ${firstName}, chọn khóa đầu tiên để bắt đầu`;
}
