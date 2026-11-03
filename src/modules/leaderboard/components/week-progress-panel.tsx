import { getWeekLeaderboardSummary } from "../services/leaderboard.service";
import { getStudyStreak } from "../services/study-progress.service";
import { getDayEndRemainingLabel } from "../utils";
import { WeekProgressError } from "./week-progress-error";
import { WeekProgressView } from "./week-progress-view";

interface WeekProgressPanelProps {
  userId: string;
}

/**
 * Đọc chuỗi ngày học và hạng tuần ở server, cùng lúc. Nằm trong Suspense riêng
 * nên không giữ cả dashboard chờ
 */
export async function WeekProgressPanel({ userId }: WeekProgressPanelProps) {
  const [streak, summary] = await Promise.all([
    getStudyStreak(userId).catch((error) => {
      console.log("[leaderboard] Đọc chuỗi ngày học lỗi:", error);

      return undefined;
    }),
    getWeekLeaderboardSummary(userId).catch((error) => {
      console.log("[leaderboard] Đọc xếp hạng tuần lỗi:", error);

      return undefined;
    }),
  ]);

  if (!streak || !summary) return <WeekProgressError />;

  return (
    <WeekProgressView
      streak={streak}
      summary={summary}
      todayRemainingLabel={getDayEndRemainingLabel()}
    />
  );
}
