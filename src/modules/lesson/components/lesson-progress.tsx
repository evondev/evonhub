import { cn } from "@/shared/utils";

export interface LessonProgressProps {
  completedCount: number;
  totalCount: number;
  percent: number;
  // inline: một hàng trên header. stacked: chữ trên, thanh dưới, ở đầu mục lục
  variant: "inline" | "stacked";
  className?: string;
}

export function LessonProgress({
  completedCount,
  totalCount,
  percent,
  variant,
  className,
}: LessonProgressProps) {
  const isInline = variant === "inline";
  const countLabel = `${completedCount} / ${totalCount} bài`;
  const bar = (
    <div
      className={cn(
        "h-2 rounded-full bg-foreground/5",
        isInline && "w-28",
        !isInline && "mt-2",
      )}
    >
      <div
        className="h-2 rounded-full bg-progress transition-[width] duration-300 motion-reduce:transition-none"
        style={{ width: `${percent}%` }}
      />
    </div>
  );

  return (
    <div
      role="progressbar"
      aria-label="Tiến độ khóa học"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(isInline && "items-center gap-3", className)}
    >
      {isInline && (
        <>
          <span className="text-sm tabular-nums text-muted">{countLabel}</span>
          {bar}
          <span className="w-9 text-sm font-medium tabular-nums">
            {percent}%
          </span>
        </>
      )}
      {!isInline && (
        <>
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <span className="tabular-nums text-muted">Đã học {countLabel}</span>
            <span className="font-medium tabular-nums">{percent}%</span>
          </div>
          {bar}
        </>
      )}
    </div>
  );
}
