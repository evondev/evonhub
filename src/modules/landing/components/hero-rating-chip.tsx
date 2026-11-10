import { formatRating } from "@/modules/course/utils";
import { Star } from "lucide-react";

interface HeroRatingChipProps {
  averageRating: number;
  ratingCount: number;
}

/** Thẻ nhỏ nổi trên ảnh hero: điểm đánh giá trung bình của các khóa */
export function HeroRatingChip({
  averageRating,
  ratingCount,
}: HeroRatingChipProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border-strong bg-surface/90 px-4 py-3 shadow-popover backdrop-blur-md">
      <span className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10">
        <Star className="size-4 fill-amber-500 text-amber-500" />
      </span>
      <div>
        <p className="text-sm font-semibold tabular-nums text-foreground">
          {formatRating(averageRating)}/5 điểm
        </p>
        <p className="text-xs text-muted">Từ {ratingCount} đánh giá</p>
      </div>
    </div>
  );
}
