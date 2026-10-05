import { ROADMAP_MIN_STEP_COUNT, ROADMAP_STEPS } from "../constants";
import { BrandHeroSkeleton } from "./brand-hero-skeleton";
import { CourseCatalogSkeleton } from "./course-catalog-skeleton";
import { LearnerHeroSkeleton } from "./learner-hero-skeleton";
import { RoadmapSkeleton } from "./roadmap-skeleton";

interface DashboardSkeletonProps {
  /** Đã đăng nhập thì khối đầu trang là "Học tiếp", khách thì là khối giới thiệu */
  isSignedIn: boolean;
}

/**
 * Khung chờ theo đúng thứ tự khối của dashboard. Cảm nhận học viên có Suspense
 * riêng (không khung chờ) nên không vẽ ở đây.
 */
export function DashboardSkeleton({ isSignedIn }: DashboardSkeletonProps) {
  // Lộ trình chưa đủ bước thì trang thật ẩn khối này, khung chờ cũng vậy
  const hasRoadmap = ROADMAP_STEPS.length >= ROADMAP_MIN_STEP_COUNT;

  return (
    <div aria-busy="true" className="flex flex-col gap-8 sm:gap-10">
      {isSignedIn && <LearnerHeroSkeleton />}
      {!isSignedIn && <BrandHeroSkeleton />}
      {hasRoadmap && <RoadmapSkeleton stepCount={ROADMAP_STEPS.length} />}
      <CourseCatalogSkeleton />
      <span className="sr-only" role="status">
        Đang tải
      </span>
    </div>
  );
}
