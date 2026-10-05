import { fetchCourses } from "@/modules/course/actions";
import { CourseGridSection } from "../components/course-grid-section";
import { CourseGridSkeleton } from "../components/course-grid-skeleton";
import { LearnerDashboard } from "../components/learner-dashboard";
import { LearnerErrorDashboard } from "../components/learner-error-dashboard";
import { LearnerOverviewSkeleton } from "../components/learner-overview-skeleton";
import { OutsiderDashboard } from "../components/outsider-dashboard";
import { PreviewStateSwitcher } from "../components/preview-state-switcher";
import { PREVIEW_FIRST_NAME, PREVIEW_LEARNING_ACTIVITY } from "../constants";
import { DashboardPreviewState } from "../types";
import { buildPreviewCoursesProgress } from "../utils";

interface DashboardPreviewPageProps {
  state: DashboardPreviewState;
}

/**
 * Trang xem trước dashboard bằng khóa thật trong DB (mọi trạng thái duyệt) và
 * tiến độ mẫu. Không ghi gì vào DB. Route chỉ mở ở môi trường dev.
 */
export async function DashboardPreviewPage({
  state,
}: DashboardPreviewPageProps) {
  const courses = (await fetchCourses({ limit: 8 })) || [];
  const recommendedSection = (
    <CourseGridSection title="Đề xuất cho bạn" courses={courses.slice(4, 8)} />
  );

  return (
    <div className="flex flex-col gap-4">
      <PreviewStateSwitcher currentState={state} />
      {state === "dang-tai" && (
        <div className="flex flex-col gap-4">
          <LearnerOverviewSkeleton />
          <div className="mt-4">
            <CourseGridSkeleton />
          </div>
        </div>
      )}
      {state === "loi" && (
        <LearnerErrorDashboard recommendedSection={recommendedSection} />
      )}
      {state === "khach" && (
        <OutsiderDashboard
          recommendedSection={
            <CourseGridSection
              title="Khóa học nổi bật"
              courses={courses.slice(0, 4)}
            />
          }
        />
      )}
      {state === "nguoi-moi" && (
        <OutsiderDashboard
          firstName={PREVIEW_FIRST_NAME}
          recommendedSection={
            <CourseGridSection
              title="Khóa học nên bắt đầu"
              courses={courses.slice(0, 4)}
            />
          }
        />
      )}
      {(state === "hoc-vien" || state === "chua-noi") && (
        <LearnerDashboard
          coursesProgress={buildPreviewCoursesProgress(courses)}
          firstName={PREVIEW_FIRST_NAME}
          learningActivity={
            state === "hoc-vien" ? PREVIEW_LEARNING_ACTIVITY : undefined
          }
          recommendedSection={recommendedSection}
        />
      )}
    </div>
  );
}
