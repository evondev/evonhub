import { LeaderboardEntry } from "../../../types";
import { LeaderboardPodiumSlot } from "./leaderboard-podium-slot";

interface LeaderboardPodiumProps {
  entries: LeaderboardEntry[];
  /** Đuôi danh hiệu theo kỳ: "tuần", "tháng", "mọi thời" */
  rankTitleSuffix: string;
}

const PODIUM_SIZE = 3;

/** Ba người dẫn đầu trong một khung chia ba ô. Chưa đủ ba người thì ô trống ghi "Còn trống" */
export function LeaderboardPodium({
  entries,
  rankTitleSuffix,
}: LeaderboardPodiumProps) {
  const emptySlotCount = Math.max(0, PODIUM_SIZE - entries.length);

  return (
    <section
      aria-label="Top 3"
      className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border"
    >
      {entries.map((entry) => (
        <LeaderboardPodiumSlot
          key={entry.userId}
          entry={entry}
          rankTitleSuffix={rankTitleSuffix}
        />
      ))}
      {Array.from({ length: emptySlotCount }, (_, index) => (
        <div
          key={`empty-${index}`}
          className="grid min-w-0 place-items-center bg-surface px-2 py-5 text-sm text-muted"
        >
          Còn trống
        </div>
      ))}
    </section>
  );
}
