import { Suspense } from "react";
import { LabTopBar, LessonListContent } from "../components";

export default function LessonListPage() {
  return (
    <div className="flex-1">
      <LabTopBar />
      <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Lộ trình backend</h1>
          <p className="text-sm text-muted">
            Chuyển Evonhub sang NestJS + MySQL từng mốc. Vấp chỗ nào thì mở bài lab đúng chỗ đó.
          </p>
        </div>
        <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-surface" />}>
          <LessonListContent />
        </Suspense>
      </main>
    </div>
  );
}
