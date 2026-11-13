import {
  InterviewCoursesSkeleton,
  InterviewPageHead,
} from "@/modules/interview/components";
import { InterviewCoursesPage } from "@/modules/interview/pages";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

export default function InterviewPageRoot() {
  const { userId } = auth();

  if (!userId) return null;

  return (
    <>
      <InterviewPageHead />
      <Suspense fallback={<InterviewCoursesSkeleton />}>
        <InterviewCoursesPage />
      </Suspense>
    </>
  );
}
