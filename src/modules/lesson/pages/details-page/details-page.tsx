import { LessonItemCutomizeData } from "@/shared/types";
import { LessonContent, LessonOutline } from "./components";

export interface LessonDetailsPageProps {
  isPreviewLesson?: boolean;
  /** Link trang luyện phỏng vấn của khóa; không có thì khóa chưa có câu nào */
  interviewHref?: string;
  lessonDetails?: LessonItemCutomizeData;
  lessonId: string;
}

export function LessonDetailsPage({
  isPreviewLesson,
  interviewHref,
  lessonDetails,
  lessonId,
}: LessonDetailsPageProps) {
  const canAccessContent = !isPreviewLesson;

  if (!lessonDetails) return null;

  return (
    <>
      <LessonContent
        lessonId={lessonId}
        lessonDetails={lessonDetails}
        canAccessContent={canAccessContent}
        interviewHref={interviewHref}
      />
      {canAccessContent && <LessonOutline lessonId={lessonId} variant="panel" />}
    </>
  );
}
