import { UserAvatar } from "@/shared/components/common/user-avatar";
import { cn } from "@/shared/utils";
import { LeaderboardProfileLink } from "../../../components/leaderboard-profile-link";
import { RankMedal } from "../../../components/rank-medal";
import { StudyMinutesText } from "../../../components/study-minutes-text";
import { TierAvatarFrame } from "../../../components/tier-avatar-frame";
import { RANK_MEDAL_CLASS_NAMES, RANK_TITLES } from "../../../constants";
import { LeaderboardEntry } from "../../../types";

interface LeaderboardPodiumSlotProps {
  entry: LeaderboardEntry;
  /** Đuôi danh hiệu theo kỳ: "tuần", "tháng", "mọi thời" */
  rankTitleSuffix: string;
}

/**
 * Một ô trên bục. Dòng dưới tên là danh hiệu theo hạng trong kỳ (thay cho tên
 * bậc như các dòng dưới); bậc vẫn thấy qua huy hiệu trên avatar. Hạng nhất có
 * nền vàng nhạt và avatar to hơn một nấc
 */
export function LeaderboardPodiumSlot({
  entry,
  rankTitleSuffix,
}: LeaderboardPodiumSlotProps) {
  const isFirst = entry.rank === 1;
  const rankTitle = RANK_TITLES[entry.rank];

  return (
    <div
      className={cn(
        // Canh đáy: ô hạng 2, 3 thấp hơn nên huy chương tụt xuống, hạng nhất
        // trông như đứng cao hơn trên bục
        "flex min-w-0 flex-col items-center justify-end gap-2 px-2 py-5 text-center sm:px-4",
        isFirst &&
          "bg-gradient-to-b from-amber-50 to-surface dark:from-amber-500/10 dark:to-surface",
        !isFirst && "bg-surface",
      )}
    >
      <RankMedal rank={entry.rank} />
      <LeaderboardProfileLink
        username={entry.username}
        isDuplicate
        className="rounded-full"
      >
        <TierAvatarFrame
          level={entry.tierLevel}
          // Margin để ở khung, không ở link: không có username thì không có link
          className="mb-4 sm:mb-5"
          badgeClassName="-bottom-4 size-9 sm:-bottom-5 sm:size-10"
        >
          <UserAvatar
            name={entry.name}
            avatar={entry.avatar}
            className={cn(
              isFirst && "size-14 text-xl sm:size-16",
              !isFirst && "size-12 text-lg sm:size-14",
            )}
          />
        </TierAvatarFrame>
      </LeaderboardProfileLink>
      <div className="flex w-full min-w-0 flex-col items-center gap-1">
        <p
          className="w-full truncate text-sm font-medium text-foreground"
          title={entry.name}
        >
          <LeaderboardProfileLink
            username={entry.username}
            className="hover:underline hover:underline-offset-2"
          >
            {entry.name}
          </LeaderboardProfileLink>
        </p>
        {rankTitle && (
          <span
            className={cn(
              "max-w-full truncate rounded-full px-2 py-0.5 text-xs font-medium",
              RANK_MEDAL_CLASS_NAMES[entry.rank],
            )}
          >
            {rankTitle} {rankTitleSuffix}
          </span>
        )}
      </div>
      <p className="text-sm">
        <StudyMinutesText
          minutes={entry.minutes}
          numberClassName="text-base font-semibold sm:text-lg"
        />
      </p>
    </div>
  );
}
