import Skeleton from "@/shared/components/skeleton";

const CourseItemLoading = () => {
  return (
    <div className="flex overflow-hidden rounded-2xl border border-border bg-surface sm:flex-col">
      <Skeleton className="w-28 shrink-0 sm:aspect-video sm:w-full" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-4 w-3/5 rounded-full" />
        <Skeleton className="mt-6 h-4 w-1/3 rounded-full" />
      </div>
    </div>
  );
};

export default CourseItemLoading;
