"use client";
import { Comment } from "@/shared/features/comment";
import { LessonContent, LessonOutline } from "./components";

export interface LessonDetailsPageProps {}

export function LessonDetailsPage(_props: LessonDetailsPageProps) {
  return (
    <>
      <div className="lg:overflow-hidden lg:p-2 flex-shrink-0 w-full flex flex-col gap-3">
        <LessonContent />
        <Comment />
      </div>
      <LessonOutline />
    </>
  );
}
