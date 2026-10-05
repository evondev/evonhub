import { StudyCourse } from "../types";
import { StudyCourseRow } from "./study-course-row";

interface StudyCourseListProps {
  courses: StudyCourse[];
  selectedSlug: string;
  /** Dựng link chọn khóa; trang xem trước giữ thêm tham số của nó */
  getSelectHref: (slug: string) => string;
}

export function StudyCourseList({
  courses,
  selectedSlug,
  getSelectHref,
}: StudyCourseListProps) {
  return (
    // Từ lg dính dưới header nổi (đáy 80px); nhiều khóa thì cuộn trong cột
    <section className="min-w-0 rounded-2xl border border-border bg-surface p-2 lg:sticky lg:top-24 lg:flex lg:max-h-[calc(100vh-112px)] lg:flex-col">
      <div className="flex shrink-0 items-center justify-between px-2.5 pb-2 pt-1.5">
        <h2 className="text-base font-semibold text-foreground">
          Khóa học của bạn
        </h2>
        <span className="text-sm text-muted">{courses.length} khóa</span>
      </div>
      <ul className="scrollbar-auto-hide flex flex-col gap-0.5 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {courses.map((studyCourse) => (
          <StudyCourseRow
            key={studyCourse.course._id}
            studyCourse={studyCourse}
            isSelected={studyCourse.course.slug === selectedSlug}
            selectHref={getSelectHref(studyCourse.course.slug)}
          />
        ))}
      </ul>
    </section>
  );
}
