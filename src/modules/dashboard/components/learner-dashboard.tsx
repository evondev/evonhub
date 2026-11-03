import { CourseItemData } from "@/modules/course/types";
import { cn } from "@/shared/utils";
import { ReactNode, Suspense } from "react";
import { IN_PROGRESS_COURSE_LIMIT } from "../constants";
import { DashboardCourseProgress, RoadmapStepConfig } from "../types";
import {
  buildCatalogStats,
  buildRoadmapSteps,
  hasEnoughRoadmapSteps,
} from "../utils";
import { CourseCatalogSection } from "./course-catalog-section";
import { CourseProgressCard } from "./course-progress-card";
import { LearnerHero } from "./learner-hero";
import { PartnerFooter } from "./partner-footer";
import { RoadmapSection } from "./roadmap-section";
import { TestimonialsSection } from "./testimonials-section";

interface LearnerDashboardProps {
  coursesProgress: DashboardCourseProgress[];
  catalogCourses: CourseItemData[];
  firstName: string;
  /** Mặc định là ROADMAP_STEPS; trang xem trước truyền lộ trình giả */
  roadmapStepConfigs?: RoadmapStepConfig[];
  /** Panel "Tuần này" (chuỗi ngày học + hạng tuần), đọc riêng trong Suspense; expert không có */
  weekProgress?: ReactNode;
  /** Khối "Video ngắn", đọc riêng trong Suspense */
  videoSection?: ReactNode;
}

export function LearnerDashboard({
  coursesProgress,
  catalogCourses,
  firstName,
  roadmapStepConfigs,
  weekProgress,
  videoSection,
}: LearnerDashboardProps) {
  const inProgressCourses = coursesProgress.filter(
    (courseProgress) => courseProgress.progress < 100,
  );
  const heroCourse =
    inProgressCourses.find((courseProgress) => courseProgress.current > 0) ||
    inProgressCourses[0];
  const otherInProgressCourses = inProgressCourses.filter(
    (courseProgress) => courseProgress !== heroCourse,
  );
  const roadmapSteps = buildRoadmapSteps(
    catalogCourses,
    coursesProgress,
    roadmapStepConfigs,
  );
  const hasRoadmap = hasEnoughRoadmapSteps(roadmapSteps);
  const heroStepNumber = roadmapSteps.find(
    (step) => step.slug === heroCourse?.course.slug,
  )?.stepNumber;
  // Hero và panel "Tuần này" đứng cạnh nhau ở màn rộng; thiếu một bên thì bên
  // kia giãn hết hàng
  const hasTopPair = Boolean(heroCourse && weekProgress);

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      {(heroCourse || weekProgress) && (
        <div
          className={cn(
            "grid grid-cols-1 gap-4",
            hasTopPair && "xl:grid-cols-[minmax(0,1fr)_360px]",
          )}
        >
          {heroCourse && (
            <LearnerHero
              courseProgress={heroCourse}
              firstName={firstName}
              roadmapStepNumber={hasRoadmap ? heroStepNumber : undefined}
              roadmapStepCount={roadmapSteps.length}
            />
          )}
          {weekProgress}
        </div>
      )}
      {/* Hero chỉ nói một khóa; học nhiều khóa thì các khóa kia ở đây */}
      {otherInProgressCourses.length > 0 && (
        <CourseProgressCard
          courses={otherInProgressCourses.slice(0, IN_PROGRESS_COURSE_LIMIT)}
        />
      )}
      {videoSection}
      {hasRoadmap && <RoadmapSection steps={roadmapSteps} />}
      <CourseCatalogSection courses={catalogCourses} />
      <Suspense fallback={null}>
        <TestimonialsSection stats={buildCatalogStats(catalogCourses)} />
      </Suspense>
      <PartnerFooter />
    </div>
  );
}
