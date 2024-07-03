import Skeleton from "@/components/loading/Skeleton";

const loading = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr),400px] gap-8 items-start relative">
      <div>
        <div className="aspect-video relative mb-8">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
        <Skeleton className="h-5 mb-8" />
        <Skeleton className="h-3 mb-5" />
        <Skeleton className="h-2 mb-1" />
        <Skeleton className="h-2 mb-1" />
        <Skeleton className="h-2 mb-1" />
      </div>
      <div>
        <Skeleton className="h-[300px] rounded-lg" />
      </div>
    </div>
  );
};

export default loading;
