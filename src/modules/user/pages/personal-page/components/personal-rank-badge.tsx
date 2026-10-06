import { Gem } from "lucide-react";

interface PersonalRankBadgeProps {
  rank: number;
}

/** Huy hiệu cạnh tên, chỉ cho top 3 bảng xếp hạng */
export function PersonalRankBadge({ rank }: PersonalRankBadgeProps) {
  return (
    <span className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full bg-amber-50 px-2.5 text-xs font-medium text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
      <Gem
        aria-hidden
        className="size-3.5 text-amber-600 dark:text-amber-400"
      />
      Top {rank} bảng xếp hạng
    </span>
  );
}
