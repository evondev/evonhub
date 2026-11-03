import { MenuLinkSignal } from "@/shared/types";
import { cn } from "@/shared/utils";
import { MenuLinkSignalDot } from "./menu-link-signal-dot";

interface MenuLinkSignalBadgeProps {
  signal: MenuLinkSignal;
  isCollapsed: boolean;
}

/**
 * Cuối mục menu lúc sidebar mở: chấm primary khi có tin chưa đọc, chấm xanh
 * kèm số người khi có người. Chỉ chấm xanh nhấp nháy, hai chấm cùng nháy thì rối.
 */
export function MenuLinkSignalBadge({
  signal,
  isCollapsed,
}: MenuLinkSignalBadgeProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center gap-2 transition-opacity duration-150 motion-reduce:transition-none",
        isCollapsed && "opacity-0",
      )}
    >
      {signal.hasUnread && <MenuLinkSignalDot isUnread isPinging={false} />}
      {signal.count > 0 && (
        <span className="flex items-center gap-1.5 text-xs tabular-nums text-muted">
          <MenuLinkSignalDot isUnread={false} isPinging={signal.isLive} />
          {signal.count}
        </span>
      )}
    </span>
  );
}
