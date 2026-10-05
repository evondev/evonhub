import { CourseItemData } from "@/modules/course/types";
import { Suspense } from "react";
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
}

export function LearnerDashboard({
  coursesProgress,
  catalogCourses,
  firstName,
  roadmapStepConfigs,
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

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      {heroCourse && (
        <LearnerHero
          courseProgress={heroCourse}
          firstName={firstName}
          hasRoadmap={hasRoadmap}
          roadmapStepNumber={hasRoadmap ? heroStepNumber : undefined}
          roadmapStepCount={roadmapSteps.length}
        />
      )}
      {/* Khối đầu trang chỉ nói một khóa; học nhiều khóa thì các khóa kia ở đây */}
      {otherInProgressCourses.length > 0 && (
        <CourseProgressCard
          courses={otherInProgressCourses.slice(0, IN_PROGRESS_COURSE_LIMIT)}
        />
      )}
      {hasRoadmap && <RoadmapSection steps={roadmapSteps} />}
      <CourseCatalogSection courses={catalogCourses} />
      <Suspense fallback={null}>
        <TestimonialsSection stats={buildCatalogStats(catalogCourses)} />
      </Suspense>
      <PartnerFooter />
    </div>
  );
}
