import { Button } from "@/components/ui/button";
import { CourseCover } from "@/shared/components/course";
import { ProgressBar } from "@/shared/components/common";
import { Play, RotateCcw } from "lucide-react";
import Link from "next/link";
import { STUDY_STATUS_META } from "../constants";
import { StudyCourse, StudyOutline } from "../types";
import { getLessonUrl } from "../utils";
import { StudyOutlineList } from "./study-outline-list";

interface StudyCoursePanelProps {
  studyCourse: StudyCourse;
  outline: StudyOutline;
}

/** Panel đề cương của khóa đang chọn, chỉ hiện từ lg */
export function StudyCoursePanel({
  studyCourse,
  outline,
}: StudyCoursePanelProps) {
  const { course, status, progress, current, total } = studyCourse;
  const statusMeta = STUDY_STATUS_META[status];
  // Đang học thì vào bài tiếp theo; chưa học hay đã xong thì từ bài đầu
  const actionLesson =
    status === "in-progress" ? outline.nextLesson : outline.firstLesson;
  const ActionIcon = status === "completed" ? RotateCcw : Play;

  return (
    <section className="hidden min-w-0 overflow-hidden rounded-2xl border border-border bg-surface lg:block">
      <div className="flex items-center gap-4 border-b border-border p-5">
        <CourseCover
          image={course.image}
          sizes="160px"
          className="hidden aspect-video w-40 shrink-0 rounded-xl xl:block"
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-pretty text-lg font-semibold text-foreground">
            {course.title}
          </h2>
          <div className="mt-2 flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <ProgressBar
                progress={progress}
                className="h-2 bg-foreground/5 dark:bg-foreground/5"
              />
            </div>
            <span className="shrink-0 text-sm tabular-nums text-muted">
              {current} / {total} bài
            </span>
          </div>
        </div>
        {actionLesson && (
          <Button
            asChild
            variant="primary"
            className="shrink-0 whitespace-nowrap"
          >
            <Link href={getLessonUrl(course.slug, actionLesson.id)}>
              <ActionIcon className="size-4 shrink-0" />
              {statusMeta.actionLabel}
            </Link>
          </Button>
        )}
      </div>
      {outline.chapters.length > 0 ? (
        <StudyOutlineList outline={outline} courseSlug={course.slug} />
      ) : (
        <p className="px-5 py-8 text-center text-sm text-muted">
          Khóa này chưa có bài học
        </p>
      )}
    </section>
  );
}
