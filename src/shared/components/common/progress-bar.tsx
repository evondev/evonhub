"use client";

import { cn } from "@/shared/utils";

export interface ProgressBarProps {
  progress: number;
  className?: string;
}

export function ProgressBar({
  progress,
  className = "mb-5",
}: ProgressBarProps) {
  return (
    <div
      className={cn(
        "rounded-full h-2.5 bg-gray-200 dark:bg-grayDarkest ",
        className
      )}
    >
      <div
        className="h-full rounded-full from-[#00D583] to-[#AAFF6F] bg-gradient-to-r transition-all"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}
