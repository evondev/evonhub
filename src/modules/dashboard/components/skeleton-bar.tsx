import Skeleton from "@/shared/components/skeleton";
import { cn } from "@/shared/utils";

interface SkeletonBarProps {
  className?: string;
}

export function SkeletonBar({ className }: SkeletonBarProps) {
  return <Skeleton className={cn("h-3 rounded-full", className)} />;
}
