import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import {
  CourseGridSkeleton,
  LearnerOverview,
  LearnerOverviewSkeleton,
  OutsiderDashboard,
  RecommendedCourses,
} from "../components";

export function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    return (
      <OutsiderDashboard
        recommendedSection={
          <Suspense fallback={<CourseGridSkeleton />}>
            <RecommendedCourses title="Khóa học nổi bật" />
          </Suspense>
        }
      />
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-4">
          <LearnerOverviewSkeleton />
          <div className="mt-4">
            <CourseGridSkeleton />
          </div>
        </div>
      }
    >
      <LearnerOverview clerkUserId={userId} />
    </Suspense>
  );
}
