import { fetchCourses } from "@/modules/course/actions";
import {
  DashboardSkeleton,
  LearnerDashboard,
  LearnerErrorDashboard,
  OutsiderDashboard,
  PreviewStateSwitcher,
} from "../components";
import {
  CATALOG_COURSE_LIMIT,
  PREVIEW_FIRST_NAME,
  PREVIEW_LEARNING_ACTIVITY,
} from "../constants";
import { DashboardPreviewState } from "../types";
import { buildPreviewCoursesProgress } from "../utils";

interface DashboardPreviewPageProps {
  state: DashboardPreviewState;
}

/**
 * Trang xem trước dashboard bằng khóa thật trong DB và tiến độ mẫu. Không ghi
 * gì vào DB. Route chỉ mở ở môi trường dev.
 */
export async function DashboardPreviewPage({
  state,
}: DashboardPreviewPageProps) {
  const catalogCourses =
    (await fetchCourses({ limit: CATALOG_COURSE_LIMIT, isAll: false })) || [];

  return (
    <div className="flex flex-col gap-4">
      <PreviewStateSwitcher currentState={state} />
      {state === "dang-tai" && <DashboardSkeleton />}
      {state === "loi" && (
        <LearnerErrorDashboard catalogCourses={catalogCourses} />
      )}
      {state === "khach" && (
        <OutsiderDashboard catalogCourses={catalogCourses} />
      )}
      {state === "nguoi-moi" && (
        <OutsiderDashboard
          firstName={PREVIEW_FIRST_NAME}
          catalogCourses={catalogCourses}
        />
      )}
      {(state === "hoc-vien" || state === "chua-noi") && (
        <LearnerDashboard
          coursesProgress={buildPreviewCoursesProgress(catalogCourses)}
          catalogCourses={catalogCourses}
          firstName={PREVIEW_FIRST_NAME}
          learningActivity={
            state === "hoc-vien" ? PREVIEW_LEARNING_ACTIVITY : undefined
          }
        />
      )}
    </div>
  );
}
