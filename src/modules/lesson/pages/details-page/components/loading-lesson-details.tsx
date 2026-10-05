"use client";

import { cn } from "@/shared/utils";
import { useGlobalStore } from "@/store";
import { Loading } from "./loading";
import { LoadingOutline } from "./loading-outline";

export interface LoadingLessonDetailsProps {}

// Cùng lưới với DetailsPageLayout: cột bài học + mục lục 380px từ lg. Người
// học đã ẩn mục lục (isExpanded) thì bài học chiếm hết bề ngang như trang thật.
export function LoadingLessonDetails(_props: LoadingLessonDetailsProps) {
  const { isExpanded } = useGlobalStore();

  return (
    <div
      className={cn(
        "lg:grid lg:items-start lg:gap-6",
        !isExpanded && "lg:grid-cols-[minmax(0,1fr)_380px]",
        isExpanded && "lg:grid-cols-1",
      )}
    >
      <Loading />
      {!isExpanded && (
        <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface lg:block">
          <div className="p-5 pt-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="skeleton h-4 w-36 rounded-full" />
              <div className="skeleton size-9 rounded-xl" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="skeleton h-3 w-28 rounded-full" />
              <div className="skeleton h-3 w-8 rounded-full" />
            </div>
            <div className="skeleton mt-2 h-2 w-full rounded-full" />
          </div>
          <LoadingOutline />
        </div>
      )}
    </div>
  );
}
