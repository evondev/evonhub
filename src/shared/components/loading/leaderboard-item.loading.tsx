import { cn } from "@/shared/utils";
import Skeleton from "../skeleton";

export interface LeaderboardItemLoadingProps {
  className?: string;
}

export function LeaderboardItemLoading({
  className,
}: LeaderboardItemLoadingProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Skeleton className="size-3 rounded-full" />
      <Skeleton className="size-8 rounded-full" />
      <Skeleton className="w-10 h-2" />

      <span className="shrink-0 ml-auto font-bold text-sm px-2 py-1 rounded-full flex items-center gap-2 w-[70px] justify-center">
        <Skeleton className="size-5 rounded-full" />
        <Skeleton className="w-10 h-2" />
      </span>
    </div>
  );
}
