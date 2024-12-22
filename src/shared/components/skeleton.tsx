import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className = "" }: SkeletonProps) => {
  return <div className={cn("skeleton", className)}></div>;
};

export default Skeleton;
