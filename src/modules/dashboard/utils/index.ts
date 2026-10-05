import { CourseItemData } from "@/modules/course/types";
import { Award, BookOpen, CircleCheck, Flame } from "lucide-react";
import { PREVIEW_COURSE_PROGRESS, ROADMAP_STEPS } from "../constants";
import {
  CatalogStats,
  DashboardCourseProgress,
  DashboardLessonLink,
  LearningActivity,
  LearningStatTile,
  RoadmapStep,
  WeeklyLessonCount,
} from "../types";

const EMPTY_STAT_VALUE = "—";
const EMPTY_STAT_NOTE = "Chưa có số liệu";

/**
 * Tên để chào. Ưu tiên tên Clerk tách sẵn; không có thì lấy chữ cuối của họ
 * tên tiếng Việt: "Trần Anh Tuấn" → "Tuấn".
 */
export function getFirstName(fullName?: string, givenName?: string | null) {
  if (givenName?.trim()) return givenName.trim();

  const nameParts = (fullName || "").trim().split(/\s+/);

  return nameParts[nameParts.length - 1] || "";
}

export function getLessonFallbackUrl(
  slug: string,
  lesson?: DashboardLessonLink,
) {
  return `/${slug}/lesson?id=${lesson?._id || ""}`;
}

/** 507.786 → "507 nghìn", 1.250.000 → "1,3 triệu" */
export function formatCompactCount(count: number) {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(".", ",")} triệu`;
  }

  if (count >= 1_000) return `${Math.floor(count / 1_000)} nghìn`;

  return String(count);
}

export function buildCatalogStats(courses: CourseItemData[]): CatalogStats {
  const allRatings = courses.flatMap((course) => course.rating || []);
  const ratingTotal = allRatings.reduce((total, rating) => total + rating, 0);

  return {
    courseCount: courses.length,
    totalViews: courses.reduce(
      (total, course) => total + (course.views || 0),
      0,
    ),
    averageRating: allRatings.length ? ratingTotal / allRatings.length : 0,
    ratingCount: allRatings.length,
  };
}

/** Ghép cấu hình lộ trình với khóa thật; khóa chưa public thì bỏ bước đó */
export function buildRoadmapSteps(
  courses: CourseItemData[],
  coursesProgress: DashboardCourseProgress[] = [],
): RoadmapStep[] {
  return ROADMAP_STEPS.flatMap((stepConfig) => {
    const course = courses.find((item) => item.slug === stepConfig.slug);

    if (!course) return [];

    return [
      {
        ...stepConfig,
        course,
        courseProgress: coursesProgress.find(
          (courseProgress) => courseProgress.course.slug === stepConfig.slug,
        ),
      },
    ];
  }).map((step, index) => ({ ...step, stepNumber: index + 1 }));
}

export function getRoadmapSubtitle(steps: RoadmapStep[]) {
  const completedCount = steps.filter(
    (step) => (step.courseProgress?.progress || 0) >= 100,
  ).length;
  const currentStep = steps.find(
    (step) => (step.courseProgress?.progress || 0) < 100,
  );

  if (!currentStep) return "Bạn đã đi hết lộ trình";

  if (completedCount === 0) return `Đang ở bước ${currentStep.stepNumber}`;

  return `Xong ${completedCount} / ${steps.length} bước, đang ở bước ${currentStep.stepNumber}`;
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
      iconClassName:
        "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300",
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
      iconClassName:
        "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300",
    },
    {
      label: "Khóa đang học",
      value: String(inProgressCourses.length),
      note:
        notStartedCount > 0
          ? `${notStartedCount} khóa chưa bắt đầu`
          : `Còn ${remainingLessons} bài`,
      icon: BookOpen,
      iconClassName:
        "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300",
    },
    {
      label: "Khóa đã hoàn thành",
      value: String(completedCourses.length),
      note: completedCourses[0]?.course.title || "Chưa có khóa nào",
      icon: Award,
      iconClassName:
        "bg-teal-50 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300",
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
  return PREVIEW_COURSE_PROGRESS.flatMap((sample) => {
    const course = courses.find((item) => item.slug === sample.slug);

    if (!course) return [];

    return [
      {
        course,
        lesson: { _id: "", slug: "" },
        progress: Math.round((sample.current / sample.total) * 100),
        current: sample.current,
        total: sample.total,
      },
    ];
  });
}
