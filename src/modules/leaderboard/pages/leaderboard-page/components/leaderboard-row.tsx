import { UserAvatar } from "@/shared/components/common/user-avatar";
import { cn } from "@/shared/utils";
import { StudyMinutesText } from "../../../components/study-minutes-text";
import { TierBadge } from "../../../components/tier-badge";
import { getStudyTierByLevel } from "../../../utils";

interface LeaderboardRowProps {
  rank: number;
  name: string;
  avatar: string;
  minutes: number;
  tierLevel: number;
  isMe: boolean;
}

/** Dòng chỉ để đọc: không link, không nút, nên không có nền rê */
export function LeaderboardRow({
  rank,
  name,
  avatar,
  minutes,
  tierLevel,
  isMe,
}: LeaderboardRowProps) {
  const tier = getStudyTierByLevel(tierLevel);

  return (
    <li
      aria-current={isMe ? "true" : undefined}
      className={cn(
        "flex items-center gap-2.5 rounded-xl px-3 py-2.5 sm:gap-3",
        isMe && "bg-primary/5",
      )}
    >
      <span
        className={cn(
          "w-6 shrink-0 text-sm font-medium tabular-nums sm:w-8",
          isMe && "text-foreground",
          !isMe && "text-muted",
        )}
      >
        {rank}
      </span>
      <UserAvatar name={name} avatar={avatar} />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <p
            className="min-w-0 truncate text-sm font-medium text-foreground"
            title={name}
          >
            {name}
          </p>
          {isMe && (
            <span className="shrink-0 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
              Bạn
            </span>
          )}
        </div>
        {tier && (
          <p className="mt-0.5 flex min-w-0 items-center gap-1 text-xs text-muted">
            {/* Màn hẹp không đủ chỗ cột huy hiệu: thu nhỏ vào dòng tên bậc */}
            <TierBadge level={tierLevel} className="size-4 sm:hidden" />
            <span className="truncate">{tier.name}</span>
          </p>
        )}
      </div>
      <TierBadge level={tierLevel} className="hidden sm:block" />
      <p className="shrink-0 text-right text-sm sm:w-24">
        <StudyMinutesText minutes={minutes} />
      </p>
    </li>
  );
}
