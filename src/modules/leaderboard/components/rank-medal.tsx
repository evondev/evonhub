import { cn } from "@/shared/utils";
import { RANK_MEDAL_CLASS_NAMES } from "../constants";

interface RankMedalProps {
  rank: number;
  className?: string;
}

/** Số hạng trong ô tròn màu vàng, bạc, đồng cho top 3 */
export function RankMedal({ rank, className }: RankMedalProps) {
  return (
    <span
      className={cn(
        "grid size-7 shrink-0 place-items-center rounded-full text-sm font-semibold tabular-nums",
        RANK_MEDAL_CLASS_NAMES[rank],
        className,
      )}
    >
      {rank}
    </span>
  );
}
