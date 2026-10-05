import { getUserById } from "@/lib/actions/user.action";
import { fetchCourses } from "@/modules/course/actions";
import {
  fetchUserCourseProgress,
  fetchUserCoursesContinue,
} from "@/modules/user/actions";
import { CourseStatus } from "@/shared/constants/course.constants";
import { UserItemData } from "@/shared/types/user.types";
import { currentUser } from "@clerk/nextjs/server";
import { CATALOG_COURSE_LIMIT, LEARNER_COURSE_FETCH_LIMIT } from "../constants";
import { DashboardCourseProgress, LearningActivity } from "../types";
import { getFirstName } from "../utils";
import { LearnerDashboard } from "./learner-dashboard";
import { LearnerErrorDashboard } from "./learner-error-dashboard";
import { OutsiderDashboard } from "./outsider-dashboard";

interface LearnerOverviewProps {
  clerkUserId: string;
  /** Số bài theo ngày, theo tuần, chuỗi ngày học: tính từ History, chưa nối */
  learningActivity?: LearningActivity;
}

export async function LearnerOverview({
  clerkUserId,
  learningActivity,
}: LearnerOverviewProps) {
  // user null: chưa có hồ sơ trong DB (webhook Clerk chưa đồng bộ, hay gặp ở
  // local). undefined: truy vấn lỗi.
  const [user, continueData, catalogResult, clerkUser] = await Promise.all([
    getUserById({ userId: clerkUserId }) as Promise<
      UserItemData | null | undefined
    >,
    fetchUserCoursesContinue({
      userId: clerkUserId,
      limit: LEARNER_COURSE_FETCH_LIMIT,
    }),
    fetchCourses({
      status: CourseStatus.Approved,
      limit: CATALOG_COURSE_LIMIT,
      isAll: false,
    }),
    currentUser(),
  ]);
  const catalogCourses = catalogResult || [];
  const firstName = getFirstName(
    user?.name || clerkUser?.fullName || "",
    clerkUser?.firstName,
  );

  if (user === null) {
    return (
      <OutsiderDashboard
        firstName={firstName}
        catalogCourses={catalogCourses}
      />
    );
  }

  if (!user || !continueData) {
    return <LearnerErrorDashboard catalogCourses={catalogCourses} />;
  }

  if (continueData.courses.length === 0) {
    return (
      <OutsiderDashboard
        firstName={firstName}
        catalogCourses={catalogCourses}
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
      catalogCourses={catalogCourses}
      firstName={firstName}
      learningActivity={learningActivity}
    />
  );
}
