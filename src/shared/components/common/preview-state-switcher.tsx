import { PreviewStateLink } from "@/shared/types";
import { cn } from "@/shared/utils";
import Link from "next/link";

interface PreviewStateSwitcherProps {
  links: PreviewStateLink[];
  currentState: string;
}

/**
 * Thanh chuyển trạng thái (?tt=) của các trang xem trước, chỉ mở ở dev. Xuống
 * dòng thay vì cuộn ngang: trang nhiều trạng thái thì mục cuối khuất hẳn
 */
export function PreviewStateSwitcher({
  links,
  currentState,
}: PreviewStateSwitcherProps) {
  return (
    <nav
      aria-label="Trạng thái xem trước"
      className="flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-foreground/15 p-3 text-sm"
    >
      <span className="mr-1 shrink-0 text-xs font-medium text-muted">
        Xem trước (chỉ ở dev):
      </span>
      {links.map((stateLink) => {
        const isActive = stateLink.state === currentState;

        return (
          <Link
            key={stateLink.state}
            href={`?tt=${stateLink.state}`}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex h-8 shrink-0 items-center rounded-lg px-3 transition-colors",
              isActive && "bg-foreground/[0.12] font-medium text-foreground",
              !isActive &&
                "text-foreground/70 hover:bg-foreground/[0.08] hover:text-foreground",
            )}
          >
            {stateLink.label}
          </Link>
        );
      })}
    </nav>
  );
}
