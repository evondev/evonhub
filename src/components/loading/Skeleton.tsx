import { cn } from "@/lib/utils";

const Skeleton = ({ className = "" }: { className?: string }) => {
  return <div className={cn("skeleton", className)}></div>;
};

export default Skeleton;
