import { CourseItemData } from "@/modules/course/types";
import { CATALOG_GRID_LIMIT, IN_PROGRESS_COURSE_LIMIT } from "../constants";
import { DashboardCourseProgress, LearningActivity } from "../types";
import { buildRoadmapSteps, buildStatTiles } from "../utils";
import { CourseGridSection } from "./course-grid-section";
import { CourseProgressCard } from "./course-progress-card";
import { LearnerHero } from "./learner-hero";
import { LearningStatRow } from "./learning-stat-row";
import { PartnerFooter } from "./partner-footer";
import { RoadmapSection } from "./roadmap-section";
import { WeeklyLessonsChart } from "./weekly-lessons-chart";

interface LearnerDashboardProps {
  coursesProgress: DashboardCourseProgress[];
  catalogCourses: CourseItemData[];
  firstName: string;
  learningActivity?: LearningActivity;
}

export function LearnerDashboard({
  coursesProgress,
  catalogCourses,
  firstName,
  learningActivity,
}: LearnerDashboardProps) {
  const inProgressCourses = coursesProgress.filter(
    (courseProgress) => courseProgress.progress < 100,
  );
  const completedCourses = coursesProgress.filter(
    (courseProgress) => courseProgress.progress >= 100,
  );
  const heroCourse =
    inProgressCourses.find((courseProgress) => courseProgress.current > 0) ||
    inProgressCourses[0];
  const roadmapSteps = buildRoadmapSteps(catalogCourses, coursesProgress);
  const heroStepNumber = roadmapSteps.find(
    (step) => step.slug === heroCourse?.course.slug,
  )?.stepNumber;
  const statTiles = buildStatTiles({
    inProgressCourses,
    completedCourses,
    learningActivity,
  });

  return (
    <div className="flex flex-col gap-4">
      {heroCourse && (
        <LearnerHero
          courseProgress={heroCourse}
          firstName={firstName}
          roadmapStepNumber={heroStepNumber}
        />
      )}
      <LearningStatRow tiles={statTiles} />
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        <CourseProgressCard
          courses={inProgressCourses.slice(0, IN_PROGRESS_COURSE_LIMIT)}
        />
        <WeeklyLessonsChart weeklyLessons={learningActivity?.weeklyLessons} />
      </div>
      <div className="mt-4">
        <RoadmapSection steps={roadmapSteps} isLearner />
      </div>
      <div className="mt-4">
        <CourseGridSection
          title="Tất cả khóa học"
          courses={catalogCourses.slice(0, CATALOG_GRID_LIMIT)}
        />
      </div>
      <div className="mt-4">
        <PartnerFooter />
      </div>
    </div>
  );
}
