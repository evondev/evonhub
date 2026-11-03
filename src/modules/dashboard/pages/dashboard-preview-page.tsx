import { PREVIEW_VIDEO_LIST } from "@/modules/course/constants/video-list.constants";
import {
  WeekProgressError,
  WeekProgressSkeleton,
  WeekProgressView,
} from "@/modules/leaderboard/components";
import { PREVIEW_STREAK_STATUSES } from "@/modules/leaderboard/constants/leaderboard-preview.constants";
import { getDayEndRemainingLabel } from "@/modules/leaderboard/utils";
import {
  buildPreviewStudyStreak,
  buildPreviewWeekSummary,
} from "@/modules/leaderboard/utils/leaderboard-preview.utils";
import { PreviewStateSwitcher } from "@/shared/components/common";
import {
  DashboardSkeleton,
  LearnerDashboard,
  LearnerErrorDashboard,
  OutsiderDashboard,
} from "../components";
import { VideoRailSection } from "../components/video-rail-section";
import {
  DASHBOARD_VIDEO_LIMIT,
  PREVIEW_FIRST_NAME,
  PREVIEW_ROADMAP_STEPS,
  PREVIEW_STATE_LINKS,
} from "../constants";
import { DashboardPreviewState } from "../types";
import { buildPreviewCourses, buildPreviewCoursesProgress } from "../utils";

interface DashboardPreviewPageProps {
  state: DashboardPreviewState;
}

/**
 * Trang xem trước dashboard bằng khóa giả (khóa cũ đã gỡ, khóa mới chưa có).
 * Cảm nhận học viên vẫn đọc từ DB. Không ghi gì vào DB. Route chỉ mở ở dev.
 */
export function DashboardPreviewPage({ state }: DashboardPreviewPageProps) {
  const previewCourses = buildPreviewCourses();
  const todayRemainingLabel = getDayEndRemainingLabel();
  const previewVideos = PREVIEW_VIDEO_LIST.slice(0, DASHBOARD_VIDEO_LIMIT);

  return (
    <div className="flex flex-col gap-4">
      <PreviewStateSwitcher links={PREVIEW_STATE_LINKS} currentState={state} />
      {state === "dang-tai" && <DashboardSkeleton isSignedIn />}
      {state === "dang-tai-khach" && <DashboardSkeleton isSignedIn={false} />}
      {state === "loi" && <LearnerErrorDashboard />}
      {state === "khach" && (
        <OutsiderDashboard
          catalogCourses={previewCourses}
          roadmapStepConfigs={PREVIEW_ROADMAP_STEPS}
        />
      )}
      {state === "nguoi-moi" && (
        <OutsiderDashboard
          firstName={PREVIEW_FIRST_NAME}
          catalogCourses={previewCourses}
          roadmapStepConfigs={PREVIEW_ROADMAP_STEPS}
        />
      )}
      {state === "chua-co-khoa" && (
        <OutsiderDashboard firstName={PREVIEW_FIRST_NAME} catalogCourses={[]} />
      )}
      {state === "hoc-vien" && (
        <LearnerDashboard
          coursesProgress={buildPreviewCoursesProgress(previewCourses)}
          catalogCourses={previewCourses}
          firstName={PREVIEW_FIRST_NAME}
          roadmapStepConfigs={PREVIEW_ROADMAP_STEPS}
          weekProgress={
            <WeekProgressView
              streak={buildPreviewStudyStreak("risk")}
              summary={buildPreviewWeekSummary(true)}
              todayRemainingLabel={todayRemainingLabel}
            />
          }
          videoSection={<VideoRailSection videos={previewVideos} />}
        />
      )}
      {/* Chưa từng học, tuần này chưa có phút, chưa có video nào */}
      {state === "tuan-moi" && (
        <LearnerDashboard
          coursesProgress={buildPreviewCoursesProgress(previewCourses)}
          catalogCourses={previewCourses}
          firstName={PREVIEW_FIRST_NAME}
          roadmapStepConfigs={PREVIEW_ROADMAP_STEPS}
          weekProgress={
            <WeekProgressView
              streak={buildPreviewStudyStreak("new")}
              summary={buildPreviewWeekSummary(false)}
              todayRemainingLabel={todayRemainingLabel}
            />
          }
          videoSection={<VideoRailSection videos={[]} />}
        />
      )}
      {/* Mọi trạng thái của panel "Tuần này", vì dashboard chỉ hiện một. Màn
          rộng panel rộng 360px như cạnh hero, màn vừa giãn hết hàng */}
      {state === "chuoi-ngay-hoc" && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[repeat(auto-fill,minmax(320px,360px))]">
          {PREVIEW_STREAK_STATUSES.map((streakStatus) => (
            <WeekProgressView
              key={streakStatus}
              streak={buildPreviewStudyStreak(streakStatus)}
              summary={buildPreviewWeekSummary(streakStatus !== "new")}
              todayRemainingLabel={todayRemainingLabel}
            />
          ))}
          <WeekProgressSkeleton />
          <WeekProgressError />
        </div>
      )}
      {state === "chuoi-ngay-hoc" && <VideoRailSection />}
    </div>
  );
}
