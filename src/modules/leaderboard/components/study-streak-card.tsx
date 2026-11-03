import { getStudyStreak } from "../services/study-progress.service";
import { getDayEndRemainingLabel } from "../utils";
import { StudyStreakError } from "./study-streak-error";
import { StudyStreakPanel } from "./study-streak-panel";

interface StudyStreakCardProps {
  userId: string;
}

/** Đọc chuỗi ngày học ở server, nằm trong Suspense riêng nên không giữ cả dashboard chờ */
export async function StudyStreakCard({ userId }: StudyStreakCardProps) {
  const streak = await getStudyStreak(userId).catch((error) => {
    console.log("[leaderboard] Đọc chuỗi ngày học lỗi:", error);

    return undefined;
  });

  if (!streak) return <StudyStreakError />;

  return (
    <StudyStreakPanel
      streak={streak}
      todayRemainingLabel={getDayEndRemainingLabel()}
    />
  );
}
