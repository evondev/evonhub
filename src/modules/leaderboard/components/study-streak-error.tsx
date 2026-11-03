import { LeaderboardRetryButton } from "./leaderboard-retry-button";

/** Cùng khung với thẻ chuỗi ngày học, kèm nút thử lại */
export function StudyStreakError() {
  return (
    <section
      role="alert"
      className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm">
        <span className="font-medium text-red-600 dark:text-red-400">
          Không tải được chuỗi ngày học.
        </span>{" "}
        <span className="text-muted">Mất kết nối tới máy chủ</span>
      </p>
      <LeaderboardRetryButton size="sm" />
    </section>
  );
}
