import { StudySkeleton } from "@/modules/study/components";
import { StudyAreaPage } from "@/modules/study/pages/study-area-page";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

interface StudyPageRootProps {
  searchParams: { khoa?: string };
}

export default function StudyPageRoot({ searchParams }: StudyPageRootProps) {
  const { userId } = auth();

  if (!userId) return null;

  return (
    <Suspense key={searchParams.khoa} fallback={<StudySkeleton />}>
      <StudyAreaPage clerkUserId={userId} selectedSlug={searchParams.khoa} />
    </Suspense>
  );
}
