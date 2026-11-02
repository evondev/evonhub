import { Suspense } from "react";
import { LessonBody } from "../components";

interface LessonPageProps {
  lessonSlugPromise: Promise<string>;
}

export default function LessonPage({ lessonSlugPromise }: LessonPageProps) {
  return (
    <div className="flex-1">
      <Suspense fallback={<div className="h-14 border-b border-border-strong bg-surface" />}>
        <LessonBody lessonSlugPromise={lessonSlugPromise} />
      </Suspense>
    </div>
  );
}
