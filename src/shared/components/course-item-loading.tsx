import Skeleton from "@/shared/components/skeleton";

const CourseItemLoading = () => {
  return (
    <div className="bg-white/30 backdrop-blur-xl border border-white dark:border-white/10 rounded-xl p-3 flex flex-col transition-all relative dark:bg-grayDarkest">
      <div className="rounded-xl h-full flex flex-col p-3 ">
        <Skeleton className="rounded-xl h-[180px]" />
        <div className="py-5 flex-1 flex flex-col">
          <div className="mb-10 flex flex-col gap-2">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-full h-4" />
          </div>
          <div className="flex items-center justify-between mb-5">
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-16 h-4" />
          </div>
          <Skeleton className="w-full h-12 mt-auto rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default CourseItemLoading;
