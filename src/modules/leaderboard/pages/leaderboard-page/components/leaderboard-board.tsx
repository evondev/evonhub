import {
  LeaderboardData,
  LeaderboardPeriod,
  LeaderboardViewer,
} from "../../../types";
import { getLeaderboardPeriodTab } from "../../../utils";
import { LeaderboardLayout } from "./leaderboard-layout";
import { LeaderboardList } from "./leaderboard-list";
import { LeaderboardMeCard } from "./leaderboard-me-card";
import { LeaderboardPodium } from "./leaderboard-podium";
import { TierProgressCard } from "./tier-progress-card";

interface LeaderboardBoardProps {
  period: LeaderboardPeriod;
  data: LeaderboardData;
  viewer: LeaderboardViewer | null;
}

const PODIUM_SIZE = 3;

/** Ráp bảng từ dữ liệu đã đọc: thẻ của bạn, thẻ bậc, bục top 3, phần còn lại của bảng */
export function LeaderboardBoard({
  period,
  data,
  viewer,
}: LeaderboardBoardProps) {
  const periodTab = getLeaderboardPeriodTab(period);
  const podiumEntries = data.entries.slice(0, PODIUM_SIZE);
  const meCard = data.standing ? (
    <>
      <LeaderboardMeCard
        periodTab={periodTab}
        standing={data.standing}
        studyDays={data.studyDays}
      />
      {data.tierProgress && (
        <TierProgressCard tierProgress={data.tierProgress} />
      )}
    </>
  ) : undefined;

  return (
    <LeaderboardLayout meCard={meCard}>
      {data.entries.length === 0 && (
        <section className="rounded-2xl border border-border bg-surface">
          <p className="px-5 py-10 text-center text-sm text-muted">
            Chưa ai có phút học trong kỳ này. Xem một bài là lên đầu bảng.
          </p>
        </section>
      )}
      {data.entries.length > 0 && (
        <>
          <LeaderboardPodium
            entries={podiumEntries}
            rankTitleSuffix={periodTab.rankTitleSuffix}
          />
          <LeaderboardList
            entries={data.entries.slice(PODIUM_SIZE)}
            podiumCount={podiumEntries.length}
            participantCount={data.participantCount}
            participantLabel={periodTab.participantLabel}
            viewer={viewer}
            standing={data.standing}
            viewerTierLevel={data.tierProgress?.tier?.level || 0}
          />
        </>
      )}
    </LeaderboardLayout>
  );
}
