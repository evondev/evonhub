import { formatRating } from "@/modules/course/utils";
import { Star } from "lucide-react";

interface ShowcaseRatingChipProps {
  averageRating: number;
  ratingCount: number;
}

/** Thẻ nhỏ nổi trên ảnh trang học: điểm đánh giá trung bình của các khóa */
export function ShowcaseRatingChip({
  averageRating,
  ratingCount,
}: ShowcaseRatingChipProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface/80 px-4 py-3 shadow-[0_20px_60px_-16px_rgb(139_92_246/0.6)] ring-1 ring-inset ring-white/15 backdrop-blur-md">
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
