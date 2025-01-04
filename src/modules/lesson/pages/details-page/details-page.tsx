"use client";
import { useParams } from "next/navigation";
import { useQueryLessonById } from "../../services";

export interface LessonDetailsPageProps {}

export function LessonDetailsPage(_props: LessonDetailsPageProps) {
  const params = useParams();
  const { data } = useQueryLessonById({
    lessonId: params.id.toString(),
  });
  console.info(`File details-page.tsx data at line 12:`, data);
  return (
    <>
      <div className="lg:overflow-hidden lg:p-2 flex-shrink-0 w-full">
        hello
      </div>
    </>
  );
}
