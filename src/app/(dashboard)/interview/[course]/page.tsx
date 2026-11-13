import { InterviewQuizSkeleton } from "@/modules/interview/components";
import { InterviewQuizPage } from "@/modules/interview/pages";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

interface InterviewQuizPageRootProps {
  params: { course: string };
}

export default function InterviewQuizPageRoot({ params }: InterviewQuizPageRootProps) {
  const { userId } = auth();

  if (!userId) return null;

  return (
    <Suspense fallback={<InterviewQuizSkeleton />}>
      <InterviewQuizPage courseSlug={params.course} />
    </Suspense>
  );
}
