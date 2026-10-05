import { ReactNode } from "react";
import { IN_PROGRESS_COURSE_LIMIT } from "../constants";
import { DashboardCourseProgress, LearningActivity } from "../types";
import { buildStatTiles } from "../utils";
import { CourseProgressCard } from "./course-progress-card";
import { LearningStatRow } from "./learning-stat-row";
import { PartnerFooter } from "./partner-footer";
import { ResumeHero } from "./resume-hero";
import { WeeklyLessonsChart } from "./weekly-lessons-chart";

interface LearnerDashboardProps {
  coursesProgress: DashboardCourseProgress[];
  firstName: string;
  learningActivity?: LearningActivity;
  recommendedSection: ReactNode;
}

export function LearnerDashboard({
  coursesProgress,
  firstName,
  learningActivity,
  recommendedSection,
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
  const statTiles = buildStatTiles({
    inProgressCourses,
    completedCourses,
    learningActivity,
  });

  return (
    <div className="flex flex-col gap-4">
      {heroCourse && (
        <ResumeHero courseProgress={heroCourse} firstName={firstName} />
      )}
      <LearningStatRow tiles={statTiles} />
      <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3">
        <CourseProgressCard
          courses={inProgressCourses.slice(0, IN_PROGRESS_COURSE_LIMIT)}
        />
        <WeeklyLessonsChart weeklyLessons={learningActivity?.weeklyLessons} />
      </div>
      <div className="mt-4">{recommendedSection}</div>
      <div className="mt-4">
        <PartnerFooter />
      </div>
    </div>
  );
}
