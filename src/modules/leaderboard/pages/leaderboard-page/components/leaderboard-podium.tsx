import { UserAvatar } from "@/shared/components/common/user-avatar";
import { RankMedal } from "../../../components/rank-medal";
import { StudyMinutesText } from "../../../components/study-minutes-text";
import { TierAvatarFrame } from "../../../components/tier-avatar-frame";
import { LeaderboardEntry } from "../../../types";

interface LeaderboardPodiumProps {
  entries: LeaderboardEntry[];
}

const PODIUM_SIZE = 3;

/** Ba người dẫn đầu trong một khung chia ba ô. Chưa đủ ba người thì ô trống ghi "Còn trống" */
export function LeaderboardPodium({ entries }: LeaderboardPodiumProps) {
  const emptySlotCount = Math.max(0, PODIUM_SIZE - entries.length);

  return (
    <section
      aria-label="Top 3"
      className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border"
    >
      {entries.map((entry) => (
        <div
          key={entry.userId}
          className="flex min-w-0 flex-col items-center gap-2 bg-surface px-2 py-5 text-center sm:px-4"
        >
          <RankMedal rank={entry.rank} />
          <TierAvatarFrame level={entry.tierLevel} className="mb-1.5">
            <UserAvatar
              name={entry.name}
              avatar={entry.avatar}
              className="size-12 text-lg sm:size-14"
            />
          </TierAvatarFrame>
          <p
            className="w-full truncate text-sm font-medium text-foreground"
            title={entry.name}
          >
            {entry.name}
          </p>
          <p className="text-sm">
            <StudyMinutesText
              minutes={entry.minutes}
              numberClassName="text-base font-semibold sm:text-lg"
            />
          </p>
        </div>
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
