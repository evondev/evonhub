import { cn } from "@/shared/utils";
import Link from "next/link";

interface ExploreFilterChipProps {
  label: string;
  href: string;
  isActive: boolean;
}

/** Chip bật tắt một bộ lọc; bấm lại chip đang bật là bỏ lọc */
export function ExploreFilterChip({
  label,
  href,
  isActive,
}: ExploreFilterChipProps) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-sm font-medium outline-none transition-colors",
        isActive && "border-primary/40 bg-primary/10 text-primary-strong",
        // Rê vào chỉ đậm viền như nút Sắp xếp: tô nền xám thì chip tan vào nền trang
        !isActive &&
          "border-border-strong bg-surface text-foreground/80 hover:border-foreground/25 hover:text-foreground",
      )}
    >
      {label}
    </Link>
  );
}
