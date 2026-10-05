import { StudyCourse, StudyOutline } from "../types";
import { StudyCourseList } from "./study-course-list";
import { StudyCoursePanel } from "./study-course-panel";
import { StudyEmpty } from "./study-empty";

interface StudyAreaProps {
  courses: StudyCourse[];
  selectedCourse?: StudyCourse;
  selectedOutline?: StudyOutline;
  getSelectHref: (slug: string) => string;
}

/** Trái là danh sách khóa, phải là đề cương khóa đang chọn */
export function StudyArea({
  courses,
  selectedCourse,
  selectedOutline,
  getSelectHref,
}: StudyAreaProps) {
  if (courses.length === 0 || !selectedCourse) return <StudyEmpty />;

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:items-start xl:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
      <StudyCourseList
        courses={courses}
        selectedSlug={selectedCourse.course.slug}
        getSelectHref={getSelectHref}
      />
      {selectedOutline && (
        <StudyCoursePanel
          studyCourse={selectedCourse}
          outline={selectedOutline}
        />
      )}
    </div>
  );
}
