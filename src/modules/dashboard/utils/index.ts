import { CourseItemData } from "@/modules/course/types";
import { formatRating } from "@/modules/course/utils";
import { RatingItemData } from "@/modules/rating/types";
import { formatCompactCount } from "@/shared/helpers";
import { cn } from "@/shared/utils";
import {
  PREVIEW_COURSE_PROGRESS,
  PREVIEW_COURSES,
  ROADMAP_MIN_STEP_COUNT,
  ROADMAP_STEPS,
  TESTIMONIAL_TWO_ROW_MIN_COUNT,
} from "../constants";
import {
  CatalogStats,
  DashboardCourseProgress,
  HeroStatItem,
  RoadmapStep,
  RoadmapStepConfig,
} from "../types";

/**
 * Tên để chào. Ưu tiên tên Clerk tách sẵn; không có thì lấy chữ cuối của họ
 * tên tiếng Việt: "Trần Anh Tuấn" → "Tuấn".
 */
export function getFirstName(fullName?: string, givenName?: string | null) {
  if (givenName?.trim()) return givenName.trim();

  const nameParts = (fullName || "").trim().split(/\s+/);

  return nameParts[nameParts.length - 1] || "";
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

/** Số liệu ở khối đầu trang; số nào bằng 0 thì bỏ, không khoe con số 0 */
export function buildHeroStatItems(stats: CatalogStats): HeroStatItem[] {
  const statItems: HeroStatItem[] = [];

  if (stats.courseCount > 0) {
    statItems.push({
      value: String(stats.courseCount),
      label: "khóa học thực chiến",
    });
  }

  if (stats.totalViews > 0) {
    statItems.push({
      value: formatCompactCount(stats.totalViews),
      label: "lượt xem bài học",
    });
  }

  if (stats.ratingCount > 0) {
    statItems.push({
      value: `${formatRating(stats.averageRating)} / 5`,
      label: `từ ${stats.ratingCount} đánh giá`,
    });
  }

  return statItems;
}

/**
 * Ghép cấu hình lộ trình với khóa thật. Khóa đã public thì bước dẫn tới khóa;
 * chưa public mà có launchLabel thì là bước sắp ra mắt; còn lại bỏ bước đó.
 */
export function buildRoadmapSteps(
  courses: CourseItemData[],
  coursesProgress: DashboardCourseProgress[] = [],
  stepConfigs: RoadmapStepConfig[] = ROADMAP_STEPS,
): RoadmapStep[] {
  return stepConfigs
    .flatMap((stepConfig) => {
      const course = courses.find((item) => item.slug === stepConfig.slug);

      if (!course && !stepConfig.launchLabel) return [];

      return [
        {
          ...stepConfig,
          course,
          courseProgress: coursesProgress.find(
            (courseProgress) => courseProgress.course.slug === stepConfig.slug,
          ),
        },
      ];
    })
    .map((step, index) => ({ ...step, stepNumber: index + 1 }));
}

export function hasEnoughRoadmapSteps(steps: RoadmapStep[]) {
  return steps.length >= ROADMAP_MIN_STEP_COUNT;
}

/** Bước đầu tiên chưa xong: người mới là bước 1, học viên là bước đang tới */
export function findNextRoadmapStep(steps: RoadmapStep[]) {
  return steps.find((step) => (step.courseProgress?.progress || 0) < 100);
}

/** Cảm nhận của khoá ghim đứng trước, bỏ cái trùng với danh sách mới nhất */
export function mergeTestimonials(
  pinnedRatings: RatingItemData[],
  latestRatings: RatingItemData[],
) {
  const pinnedIds = new Set(pinnedRatings.map((rating) => rating._id));

  return [
    ...pinnedRatings,
    ...latestRatings.filter((rating) => !pinnedIds.has(rating._id)),
  ];
}

/** Đủ nhiều thì chia xen kẽ hai dải để cảm nhận dài ngắn rải đều cả hai */
export function splitTestimonialRows(ratings: RatingItemData[]) {
  if (ratings.length < TESTIMONIAL_TWO_ROW_MIN_COUNT) return [ratings];

  return [
    ratings.filter((rating, index) => index % 2 === 0),
    ratings.filter((rating, index) => index % 2 === 1),
  ];
}

/**
 * Khóa giả cho trang xem trước ở dev. Ép kiểu vì CourseItemData kế thừa
 * Document của Mongoose; trang xem trước chỉ đọc các trường hiển thị.
 */
export function buildPreviewCourses(): CourseItemData[] {
  return PREVIEW_COURSES.map(
    (seed) =>
      ({
        ...seed,
        _id: seed.slug,
        lecture: [],
      }) as unknown as CourseItemData,
  );
}

/** Gắn tiến độ mẫu vào khóa giả cho trang xem trước ở dev */
export function buildPreviewCoursesProgress(
  courses: CourseItemData[],
): DashboardCourseProgress[] {
  return PREVIEW_COURSE_PROGRESS.flatMap((sample) => {
    const course = courses.find((item) => item.slug === sample.slug);

    if (!course) return [];

    return [
      {
        course,
        lesson: {
          _id: "",
          slug: "",
          title: sample.lessonTitle,
          duration: sample.lessonDuration,
        },
        progress: Math.round((sample.current / sample.total) * 100),
        current: sample.current,
        total: sample.total,
      },
    ];
  });
}

/** Dòng dưới thanh tiến độ ở hero: còn mấy bài, sắp xong thì nói thẳng */
export function getLearnerHeroStatusText(current: number, total: number) {
  if (total === 0) return "Khóa chưa có bài học nào";

  if (current === 0) return "Chưa bắt đầu, vào học bài đầu tiên";

  const remainingCount = Math.max(total - current, 1);

  if (remainingCount === 1) return "Còn 1 bài là hoàn thành khóa";

  return `Còn ${remainingCount} bài`;
}

/**
 * Dòng nhỏ trên tên bài ở hero. Nút "Học tiếp" mở bài đang học dở (hay bài
 * đầu), không phải bài kế tiếp, nên không gọi là "bài tiếp theo"
 */
export function getResumeLessonLabel(
  isFirstLesson: boolean,
  duration?: number,
) {
  const label = isFirstLesson ? "Bài đầu tiên" : "Bài đang học";

  if (!duration) return label;

  return `${label} · ${duration} phút`;
}

/**
 * Hàng video ngắn: điện thoại cuộn ngang đủ mọi thẻ, sm và lg lưới 2×2, xl một hàng 3,
 * 2xl một hàng 4. Thẻ thứ 5, 6 chỉ có ở hàng cuộn
 */
export function getVideoRailItemClassName(index: number) {
  return cn(
    "grid w-[260px] shrink-0 snap-start",
    index < 4 && "sm:w-auto",
    index === 3 && "xl:hidden 2xl:grid",
    index >= 4 && "sm:hidden",
  );
}
