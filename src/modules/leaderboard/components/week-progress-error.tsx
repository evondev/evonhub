import { LeaderboardRetryButton } from "./leaderboard-retry-button";

/** Cùng khung với panel "Tuần này", kèm nút thử lại */
export function WeekProgressError() {
  return (
    <section
      role="alert"
      className="flex min-w-0 flex-col items-start gap-3 rounded-2xl border border-border bg-surface p-5"
    >
      <p className="text-sm">
        <span className="font-medium text-red-600 dark:text-red-400">
          Không tải được chuỗi ngày và xếp hạng.
        </span>{" "}
        <span className="text-muted">Mất kết nối tới máy chủ</span>
      </p>
      <LeaderboardRetryButton size="sm" />
    </section>
  );
}
