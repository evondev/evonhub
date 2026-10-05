import { getUserById } from "@/lib/actions/user.action";
import {
  fetchUserCourseProgress,
  fetchUserCoursesContinue,
} from "@/modules/user/actions";
import { UserItemData } from "@/shared/types/user.types";
import { currentUser } from "@clerk/nextjs/server";
import { Suspense } from "react";
import { LEARNER_COURSE_FETCH_LIMIT } from "../constants";
import { DashboardCourseProgress, LearningActivity } from "../types";
import { getFirstName } from "../utils";
import { CourseGridSkeleton } from "./course-grid-skeleton";
import { LearnerDashboard } from "./learner-dashboard";
import { LearnerErrorDashboard } from "./learner-error-dashboard";
import { OutsiderDashboard } from "./outsider-dashboard";
import { RecommendedCourses } from "./recommended-courses";

interface LearnerOverviewProps {
  clerkUserId: string;
  /** Số bài theo ngày, theo tuần, chuỗi ngày học: tính từ History, chưa nối */
  learningActivity?: LearningActivity;
}

export async function LearnerOverview({
  clerkUserId,
  learningActivity,
}: LearnerOverviewProps) {
  // null: chưa có hồ sơ trong DB (webhook Clerk chưa đồng bộ, hay gặp ở local).
  // undefined: truy vấn lỗi.
  const user = (await getUserById({ userId: clerkUserId })) as
    UserItemData | null | undefined;
  const continueData = await fetchUserCoursesContinue({
    userId: clerkUserId,
    limit: LEARNER_COURSE_FETCH_LIMIT,
  });
  const recommendedSection = (
    <Suspense fallback={<CourseGridSkeleton />}>
      <RecommendedCourses title="Đề xuất cho bạn" shouldFilterEnrolled />
    </Suspense>
  );

  if (user === null) {
    const clerkUser = await currentUser();

    return (
      <OutsiderDashboard
        firstName={getFirstName(clerkUser?.fullName || "")}
        recommendedSection={
          <Suspense fallback={<CourseGridSkeleton />}>
            <RecommendedCourses title="Khóa học nên bắt đầu" />
          </Suspense>
        }
      />
    );
  }

  if (!user || !continueData) {
    return <LearnerErrorDashboard recommendedSection={recommendedSection} />;
  }

  const firstName = getFirstName(user.name || user.username);

  if (continueData.courses.length === 0) {
    return (
      <OutsiderDashboard
        firstName={firstName}
        recommendedSection={
          <Suspense fallback={<CourseGridSkeleton />}>
            <RecommendedCourses title="Khóa học nên bắt đầu" />
          </Suspense>
        }
      />
    );
  }

  const coursesProgress: DashboardCourseProgress[] = await Promise.all(
    continueData.courses.map(async (course, index) => {
      const courseProgress = await fetchUserCourseProgress({
        userId: user._id.toString(),
        courseId: course._id.toString(),
      });

      return {
        course,
        lesson: continueData.lessons[index],
        progress: Math.min(courseProgress?.progress || 0, 100),
        current: courseProgress?.current || 0,
        total: courseProgress?.total || 0,
      };
    }),
  );

  return (
    <LearnerDashboard
      coursesProgress={coursesProgress}
      firstName={firstName}
      learningActivity={learningActivity}
      recommendedSection={recommendedSection}
    />
  );
}
