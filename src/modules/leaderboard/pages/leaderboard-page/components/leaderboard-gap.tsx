import { formatThoundsand } from "@/shared/utils";
import { LeaderboardStanding } from "../../../types";

interface LeaderboardGapProps {
  standing: LeaderboardStanding;
}

/** Còn bao nhiêu phút để vượt người ngay trên, kèm thanh đã đi được bao xa */
export function LeaderboardGap({ standing }: LeaderboardGapProps) {
  const { above } = standing;

  if (!above) {
    return <p className="text-sm text-muted">Bạn đang dẫn đầu bảng.</p>;
  }

  const targetMinutes = standing.minutes + above.gapMinutes;
  const progressPercent = Math.round((standing.minutes / targetMinutes) * 100);

  return (
    <div>
      <p className="text-pretty text-sm text-muted">
        Còn{" "}
        <span className="font-semibold tabular-nums text-foreground">
          {formatThoundsand(above.gapMinutes)} phút
        </span>{" "}
        để vượt <span className="font-medium text-foreground">{above.name}</span>{" "}
        <span className="tabular-nums">(#{above.rank})</span>
      </p>
      <div
        role="progressbar"
        aria-label={`Tới hạng ${above.rank}`}
        aria-valuenow={standing.minutes}
        aria-valuemin={0}
        aria-valuemax={targetMinutes}
        className="mt-2 h-2 rounded-full bg-foreground/5"
      >
        <div
          className="h-2 rounded-full bg-primary"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
