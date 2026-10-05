import { Button } from "@/components/ui/button";
import { COURSE_CURRICULUM_SECTION_ID } from "@/modules/course/constants";
import type { CourseCurriculumStats } from "@/modules/course/types";
import { formatDurationMinutes, getChapterValue } from "@/modules/course/utils";
import { LessonDetailsOutlineData } from "@/shared/types";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import CourseCurriculumChapter from "./course-curriculum-chapter";
import CourseSection from "./course-section";

export interface CourseCurriculumProps {
  lectures: LessonDetailsOutlineData[];
  stats: CourseCurriculumStats;
  courseSlug: string;
  isOwned: boolean;
  /** Các chương đang mở, giá trị là `getChapterValue(index)` */
  openChapters: string[];
  onOpenChaptersChange: (openChapters: string[]) => void;
}

export default function CourseCurriculum({
  lectures,
  stats,
  courseSlug,
  isOwned,
  openChapters,
  onOpenChaptersChange,
}: CourseCurriculumProps) {
  const isAllOpen =
    lectures.length > 0 && openChapters.length === lectures.length;
  const summary =
    stats.chapterCount > 0
      ? `${stats.chapterCount} chương · ${stats.lessonCount} bài · ${formatDurationMinutes(stats.totalMinutes)}`
      : "";

  function handleToggleAll() {
    if (isAllOpen) {
      onOpenChaptersChange([]);
      return;
    }
    onOpenChaptersChange(lectures.map((_, index) => getChapterValue(index)));
  }

  const toggleAllButton = lectures.length > 0 && (
    <Button
      variant="link"
      className="h-8 shrink-0 px-0 text-foreground/70 hover:text-foreground"
      onClick={handleToggleAll}
    >
      {isAllOpen ? "Thu gọn tất cả" : "Mở tất cả"}
    </Button>
  );

  return (
    <CourseSection
      id={COURSE_CURRICULUM_SECTION_ID}
      title="Nội dung khóa học"
      description={summary}
      action={toggleAllButton}
    >
      {lectures.length === 0 && (
        <div className="rounded-2xl border border-border bg-surface px-5 py-10 text-center text-sm text-muted">
          Nội dung khóa học đang được cập nhật
        </div>
      )}
      {lectures.length > 0 && (
        <AccordionPrimitive.Root
          type="multiple"
          value={openChapters}
          onValueChange={onOpenChaptersChange}
          className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface"
        >
          {lectures.map((lecture, index) => (
            <CourseCurriculumChapter
              key={getChapterValue(index)}
              value={getChapterValue(index)}
              lecture={lecture}
              courseSlug={courseSlug}
              isOwned={isOwned}
            />
          ))}
        </AccordionPrimitive.Root>
      )}
    </CourseSection>
  );
}
