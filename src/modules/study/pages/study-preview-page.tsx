import {
  StudyArea,
  StudyLoadError,
  StudyPreviewStateSwitcher,
  StudySkeleton,
} from "../components";
import { StudyPreviewState } from "../types";
import {
  buildPreviewStudyCourses,
  buildPreviewStudyOutline,
  findSelectedStudyCourse,
} from "../utils";

interface StudyPreviewPageProps {
  state: StudyPreviewState;
  selectedSlug?: string;
}

/**
 * Trang xem trước khu vực học tập bằng khóa và đề cương giả. Không đọc hay ghi
 * DB. Route chỉ mở ở dev.
 */
export function StudyPreviewPage({
  state,
  selectedSlug,
}: StudyPreviewPageProps) {
  const allCourses = buildPreviewStudyCourses();
  const courses = state === "mot-khoa" ? allCourses.slice(0, 1) : allCourses;
  const visibleCourses = state === "rong" ? [] : courses;
  const selectedCourse = findSelectedStudyCourse(visibleCourses, selectedSlug);
  const getSelectHref = (slug: string) => `?tt=${state}&khoa=${slug}`;

  return (
    <div className="flex flex-col gap-4">
      <StudyPreviewStateSwitcher currentState={state} />
      {state === "dang-tai" && <StudySkeleton />}
      {state === "loi" && <StudyLoadError />}
      {!["dang-tai", "loi"].includes(state) && (
        <StudyArea
          courses={visibleCourses}
          selectedCourse={selectedCourse}
          selectedOutline={
            selectedCourse
              ? buildPreviewStudyOutline(selectedCourse)
              : undefined
          }
          getSelectHref={getSelectHref}
        />
      )}
    </div>
  );
}
