"use client";

import { cn } from "@/shared/utils";

export interface ProgressBarProps {
  progress: number;
  className?: string;
  current?: number;
  total?: number;
  shouldShowLabel?: boolean;
  wrapperClassName?: string;
  fillClassName?: string;
}

export function ProgressBar({
  progress,
  className = "mb-5",
  current = 0,
  total = 0,
  shouldShowLabel = false,
  wrapperClassName = "",
  fillClassName = "",
}: ProgressBarProps) {
  return (
    <div className={cn("flex flex-col", wrapperClassName)}>
      {shouldShowLabel && (
        <div className="flex text-xs font-medium mb-0.5">
          <strong className="font-bold">{current}</strong>
          <span>/</span>
          <span>{total}</span>
        </div>
      )}
      <div
        className={cn(
          "rounded-full h-2 bg-gray-200 dark:bg-grayDarkest ",
          className,
        )}
      >
        <div
          className={cn(
            "h-full rounded-[inherit] bg-green-400 transition-all",
            fillClassName,
          )}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}
