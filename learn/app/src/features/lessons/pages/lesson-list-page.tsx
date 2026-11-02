import { Suspense } from "react";
import { LabTopBar, LessonListContent } from "../components";

export default function LessonListPage() {
  return (
    <div className="flex-1">
      {/* Dải brand ôm thanh trên và tên trang (P12 công thức A); nội dung bắt đầu lại trên nền trang. */}
      <div className="bg-primary bg-linear-to-r from-primary to-primary-hover text-primary-foreground">
        <LabTopBar />
        <div className="mx-auto max-w-6xl space-y-1 px-4 pt-2 pb-8 sm:px-6">
          <h1 className="text-xl font-semibold">Lộ trình backend</h1>
          <p className="text-sm">Chuyển Evonhub sang NestJS + MySQL từng mốc. Vấp chỗ nào thì mở bài lab đúng chỗ đó.</p>
        </div>
      </div>
      <main className="mx-auto max-w-6xl p-4 sm:p-6">
        <Suspense fallback={<div className="h-64 animate-pulse rounded-xl bg-surface" />}>
          <LessonListContent />
        </Suspense>
      </main>
    </div>
  );
}
