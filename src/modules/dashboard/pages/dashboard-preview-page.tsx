import {
  DashboardSkeleton,
  LearnerDashboard,
  LearnerErrorDashboard,
  OutsiderDashboard,
  PreviewStateSwitcher,
} from "../components";
import { PREVIEW_FIRST_NAME, PREVIEW_ROADMAP_STEPS } from "../constants";
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

  return (
    <div className="flex flex-col gap-4">
      <PreviewStateSwitcher currentState={state} />
      {state === "dang-tai" && <DashboardSkeleton />}
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
        />
      )}
    </div>
  );
}
