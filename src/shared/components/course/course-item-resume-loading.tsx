"use client";

import Skeleton from "../skeleton";

export interface CourseItemResumeLoadingProps {}

export function CourseItemResumeLoading() {
  return (
    <div className="p-3 rounded-xl flex-wrap lg:flex-nowrap bgDarkMode flex items-center gap-2 lg:gap-5">
      <Skeleton className="w-[150px] aspect-video object-cover rounded-lg transition-all"></Skeleton>
      <div className="flex flex-col gap-3 flex-1 max-w-[500px]">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full hidden lg:block" />
      </div>
      <div className="shrink-0 w-full gap-3 items-center flex justify-end lg:block lg:w-auto lg:ml-auto">
        <Skeleton className="h-3 w-full hidden lg:block" />
        <Skeleton className="h-12 rounded-xl w-full" />
      </div>
    </div>
  );
}
