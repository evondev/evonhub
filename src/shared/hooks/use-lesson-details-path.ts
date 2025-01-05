"use client";

import { usePathname, useSearchParams } from "next/navigation";

export function useLessonDetailsPath() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const fullPath = `${pathname}?${searchParams.toString()}`;
  const isLessonPage = fullPath.includes("lesson?id=");
  return {
    isLessonPage,
  };
}
