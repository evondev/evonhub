"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/shared/utils";
import { STUDY_TIERS } from "../../../constants";
import { TierBadge } from "../../../components/tier-badge";
import { formatStudyDuration } from "../../../utils";

interface TierLadderDialogProps {
  /** 0: chưa có bậc */
  currentLevel: number;
  /** Câu dưới bậc hiện tại, ví dụ "còn 12 giờ 20 phút lên bậc kế" */
  currentHint: string;
}

const HIGHEST_FIRST_TIERS = [...STUDY_TIERS].reverse();

/** Mười bậc, cao nhất ở trên; bậc đang ở tô nổi, bậc chưa tới xám mờ */
export function TierLadderDialog({
  currentLevel,
  currentHint,
}: TierLadderDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="-mr-2 font-semibold text-primary-strong hover:text-primary-strong"
        >
          Xem 10 bậc
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-md gap-0 overflow-y-auto rounded-2xl border-border bg-surface p-5 dark:border-border dark:bg-surface">
        <DialogTitle className="text-lg font-semibold text-foreground">
          10 bậc học
        </DialogTitle>
        <DialogDescription className="mb-4 mt-1 text-pretty text-sm text-muted">
          Tính theo tổng giờ học từ trước tới nay, chỉ tăng không giảm.
        </DialogDescription>
        <ol className="flex flex-col gap-1">
          {HIGHEST_FIRST_TIERS.map((tier) => {
            const isCurrent = tier.level === currentLevel;
            const isLocked = tier.level > currentLevel;

            return (
              <li
                key={tier.level}
                aria-current={isCurrent ? "true" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-2 py-1.5",
                  isCurrent && "bg-primary/10",
                )}
              >
                <TierBadge
                  level={tier.level}
                  isLocked={isLocked}
                  className="size-10"
                />
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "truncate text-sm",
                      isCurrent && "font-semibold text-primary-strong",
                      isLocked && "text-muted",
                      !isCurrent && !isLocked && "font-medium text-foreground",
                    )}
                  >
                    {tier.level}. {tier.name}
                  </p>
                  {isCurrent && (
                    <p className="text-xs text-foreground/75">{currentHint}</p>
                  )}
                </div>
                <span
                  className={cn(
                    "shrink-0 text-xs tabular-nums",
                    isCurrent && "text-foreground/75",
                    !isCurrent && "text-muted",
                  )}
                >
                  {tier.level === 1
                    ? "phút đầu tiên"
                    : `từ ${formatStudyDuration(tier.minSeconds)}`}
                </span>
              </li>
            );
          })}
        </ol>
      </DialogContent>
    </Dialog>
  );
}
