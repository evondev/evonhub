import { Button } from "@/components/ui/button";
import { formatThoundsand } from "@/shared/utils";
import { Play } from "lucide-react";
import Link from "next/link";
import { LEADERBOARD_EMPTY_HINT, STUDY_PATH } from "../../../constants";
import {
  LeaderboardPeriodTab,
  LeaderboardStanding,
  StudyDayPoint,
} from "../../../types";
import { LeaderboardGap } from "./leaderboard-gap";
import { StudyDayChart } from "./study-day-chart";

interface LeaderboardMeCardProps {
  periodTab: LeaderboardPeriodTab;
  standing: LeaderboardStanding;
  studyDays: StudyDayPoint[];
}

/** Thẻ của bạn: hạng, phút, còn bao nhiêu để vượt người trên, biểu đồ 7 ngày */
export function LeaderboardMeCard({
  periodTab,
  standing,
  studyDays,
}: LeaderboardMeCardProps) {
  const isRanked = standing.rank > 0;

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5">
      <h2 className="text-base font-semibold text-foreground">
        {periodTab.meTitle}
      </h2>
      {!isRanked && (
        <p className="text-pretty text-sm text-muted">
          {periodTab.emptyText} {LEADERBOARD_EMPTY_HINT}
        </p>
      )}
      {isRanked && (
        <>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border">
            <div className="min-w-0 bg-surface p-4">
              <p className="text-xs font-medium text-muted">Hạng</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                #{standing.rank}
              </p>
            </div>
            <div className="min-w-0 bg-surface p-4">
              <p className="text-xs font-medium text-muted">Phút học</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                {formatThoundsand(standing.minutes)}
              </p>
            </div>
          </div>
          <LeaderboardGap standing={standing} />
        </>
      )}
      <Button asChild variant="primary" className="w-full">
        <Link href={STUDY_PATH}>
          <Play className="size-4 shrink-0" />
          Học tiếp
        </Link>
      </Button>
      {isRanked && (
        <div className="border-t border-border pt-4">
          <p className="mb-3 text-sm font-medium text-foreground">
            {studyDays.length} ngày gần nhất
          </p>
          <StudyDayChart studyDays={studyDays} />
        </div>
      )}
    </section>
  );
}
