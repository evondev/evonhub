import { Comment } from "@/shared/features/comment";
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
      <div className="flex-shrink-0 w-full flex flex-col gap-3">
        <LessonContent
          lessonId={lessonId}
          lessonDetails={lessonDetails}
          canAccessContent={canAccessContent}
        />
        {canAccessContent && <Comment lessonId={lessonId} />}
      </div>
      {canAccessContent && <LessonOutline lessonId={lessonId} />}
    </>
  );
}
