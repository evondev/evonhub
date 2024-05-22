import Skeleton from "./Skeleton";

const CourseItemWrapperSkeleton = () => {
  return (
    <div className="rounded-lg flex flex-col transition-all">
      <Skeleton className="rounded-xl h-[180px]" />
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3 text-sm font-medium">
          <Skeleton className="w-10 h-4" />
          <Skeleton className="w-10 h-4" />
        </div>
        <Skeleton className="h-8 mb-5" />
        <div className="mt-auto flex flex-col gap-8">
          <Skeleton className="w-20 h-5" />
        </div>
      </div>
    </div>
  );
};

export default CourseItemWrapperSkeleton;
