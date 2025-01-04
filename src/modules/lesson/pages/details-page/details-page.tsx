"use client";
import { LessonContent, LessonOutline } from "./components";

export interface LessonDetailsPageProps {}

export function LessonDetailsPage(_props: LessonDetailsPageProps) {
  return (
    <>
      <div className="lg:overflow-hidden lg:p-2 flex-shrink-0 w-full">
        <LessonContent />
      </div>
      <LessonOutline />
    </>
  );
}
