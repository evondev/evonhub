import { cn } from "@/utils/cn";

interface ProgressBarProps {
  doneCount: number;
  totalCount: number;
  className?: string;
}

export default function ProgressBar({ doneCount, totalCount, className }: ProgressBarProps) {
  const progressPercent = totalCount ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <div className={cn("h-1.5 w-28 overflow-hidden rounded-full bg-secondary", className)}>
      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progressPercent}%` }} />
    </div>
  );
}
