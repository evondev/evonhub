"use client";

import { Loading } from "./loading";
import { LoadingOutline } from "./loading-outline";

export interface LoadingLessonDetailsProps {}

export function LoadingLessonDetails(_props: LoadingLessonDetailsProps) {
  return (
    <div className="-mt-8 lg:mt-0 flex flex-col lg:grid overflow-hidden lg:overflow-visible h-[calc(100svh-140px)] sm:h-auto grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,400px)] gap-0 lg:gap-8 items-start transition-all relative -mx-5 -mb-7 lg:mb-0 lg:mx-0 lg:grid">
      <div className="lg:overflow-hidden flex-shrink-0 w-full flex flex-col gap-3">
        <Loading />
      </div>
      <LoadingOutline />
    </div>
  );
}
