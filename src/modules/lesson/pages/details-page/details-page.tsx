import { LessonItemCutomizeData } from "@/shared/types";
import { LessonContent, LessonOutline } from "./components";

export interface LessonDetailsPageProps {
  isPreviewLesson?: boolean;
  lessonDetails?: LessonItemCutomizeData;
  lessonId: string;
}

export function LessonDetailsPage({
  isPreviewLesson,
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
      />
      {canAccessContent && <LessonOutline lessonId={lessonId} variant="panel" />}
    </>
  );
}
