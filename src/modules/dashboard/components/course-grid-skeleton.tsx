import CourseItemLoading from "@/shared/components/course-item-loading";
import { RECOMMENDED_COURSE_LIMIT } from "../constants";
import { SkeletonBar } from "./skeleton-bar";

export function CourseGridSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-3">
      <SkeletonBar className="h-5 w-40" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: RECOMMENDED_COURSE_LIMIT }, (_, index) => (
          <CourseItemLoading key={index} />
        ))}
      </div>
    </div>
  );
}
