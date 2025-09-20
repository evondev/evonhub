"use client";

import { cn } from "@/shared/utils";

export interface ProgressBarProps {
  progress: number;
  className?: string;
  current?: number;
  total?: number;
  shouldShowLabel?: boolean;
}

export function ProgressBar({
  progress,
  className = "mb-5",
  current = 0,
  total = 0,
  shouldShowLabel = false,
}: ProgressBarProps) {
  return (
    <div className="flex flex-col">
      {shouldShowLabel && (
        <div className="flex text-xs font-medium mb-0.5">
          <strong className="font-extrabold">{current}</strong>
          <span>/</span>
          <span>{total}</span>
        </div>
      )}
      <div
        className={cn(
          "rounded-full h-2 bg-gray-200 dark:bg-grayDarkest ",
          className
        )}
      >
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
