import { Suspense } from "react";
import { LeaderboardPeriod } from "../../types";
import { LeaderboardContent } from "./components/leaderboard-content";
import { LeaderboardPeriodTabs } from "./components/leaderboard-period-tabs";
import { LeaderboardSkeleton } from "./components/leaderboard-skeleton";

interface LeaderboardPageProps {
  period: LeaderboardPeriod;
}

/** Tên trang nằm trên thanh header; tab kỳ đứng ngoài Suspense nên đổi kỳ không nháy tab */
export function LeaderboardPage({ period }: LeaderboardPageProps) {
  return (
    <div className="flex flex-col gap-6">
      <LeaderboardPeriodTabs period={period} />
      <Suspense key={period} fallback={<LeaderboardSkeleton />}>
        <LeaderboardContent period={period} />
      </Suspense>
    </div>
  );
}
