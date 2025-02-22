"use client";
import { Comment } from "@/shared/features/comment";
import { useSearchParams } from "next/navigation";
import { useQueryLessonById } from "../../services";
import { LessonContent, LessonOutline } from "./components";

export interface LessonDetailsPageProps {}

export function LessonDetailsPage(_props: LessonDetailsPageProps) {
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("id")?.toString() || "";
  const { data: lessonDetails, isLoading } = useQueryLessonById({
    lessonId,
    enabled: !!lessonId,
  });
  if (!lessonDetails) return null;
  return (
    <>
      <div className="lg:overflow-hidden flex-shrink-0 w-full flex flex-col gap-3">
        <LessonContent
          lessonId={lessonId}
          lessonDetails={lessonDetails}
          isLoading={isLoading}
        />
        <Comment lessonId={lessonId} />
      </div>
      <LessonOutline lessonId={lessonId} />
    </>
  );
}
