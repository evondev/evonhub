import { STUDY_TIERS } from "../../../constants";
import { TierBadge } from "../../../components/tier-badge";
import { TierProgress } from "../../../types";
import { formatStudyDuration } from "../../../utils";
import { TierLadderDialog } from "./tier-ladder-dialog";

interface TierProgressCardProps {
  tierProgress: TierProgress;
}

/** Bậc hiện tại theo tổng giờ học, thanh tiến độ và còn bao lâu lên bậc kế */
export function TierProgressCard({ tierProgress }: TierProgressCardProps) {
  const { tier, nextTier, totalSeconds, remainingSeconds, percent } =
    tierProgress;
  const remainingText = formatStudyDuration(remainingSeconds, true);
  const nextTierHint = nextTier
    ? `còn ${remainingText} lên ${nextTier.name}`
    : "Bậc cao nhất";

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold text-foreground">Bậc của bạn</h2>
        <TierLadderDialog
          currentLevel={tier?.level || 0}
          currentHint={nextTierHint}
        />
      </div>
      <div className="flex items-center gap-4">
        <TierBadge
          level={tier?.level || STUDY_TIERS[0].level}
          isLocked={!tier}
          className="size-16"
        />
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-foreground">
            {tier ? `Bậc ${tier.level} · ${tier.name}` : "Chưa có bậc"}
          </p>
          <p className="text-xs text-muted">
            Tổng {formatStudyDuration(totalSeconds)} học
          </p>
        </div>
      </div>
      <div>
        <div
          role="progressbar"
          aria-label="Tiến độ lên bậc kế"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-2 overflow-hidden rounded-full bg-item-active"
        >
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 text-xs text-muted">
          <p className="text-pretty">
            {!tier && "Học phút đầu tiên để nhận bậc Tập sự"}
            {tier && nextTier && (
              <>
                Còn{" "}
                <span className="font-semibold tabular-nums text-foreground">
                  {remainingText}
                </span>{" "}
                lên {nextTier.name}
              </>
            )}
            {tier && !nextTier && "Bạn đã ở bậc cao nhất"}
          </p>
          {tier && nextTier && (
            <TierBadge level={nextTier.level} isLocked className="size-6" />
          )}
        </div>
      </div>
    </section>
  );
}
