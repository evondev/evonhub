import { getFilterChipClassName } from "@/shared/utils";
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
      className={getFilterChipClassName(isActive)}
    >
      {label}
    </Link>
  );
}
