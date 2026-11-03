import { cn } from "@/shared/utils";

interface MenuLinkSignalDotProps {
  /** Có cái mới chưa xem: màu primary. Không thì xanh lá như chấm online trong phòng chat */
  isUnread: boolean;
  isPinging: boolean;
  /** Viền màu nền khi chấm đè lên icon */
  hasRing?: boolean;
  className?: string;
}

/** Chấm tròn 8px của tín hiệu trên menu, nhấp nháy khi đang có hoạt động */
export function MenuLinkSignalDot({
  isUnread,
  isPinging,
  hasRing = false,
  className,
}: MenuLinkSignalDotProps) {
  return (
    <span aria-hidden="true" className={cn("relative flex size-2", className)}>
      {isPinging && (
        <span
          className={cn(
            "absolute inset-0 animate-ping rounded-full motion-reduce:animate-none",
            isUnread && "bg-primary/60",
            !isUnread && "bg-green-600/60",
          )}
        />
      )}
      <span
        className={cn(
          "relative size-2 rounded-full",
          hasRing && "ring-2 ring-surface",
          isUnread && "bg-primary",
          !isUnread && "bg-green-600",
        )}
      />
    </span>
  );
}
