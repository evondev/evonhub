import { LeaderboardRetryButton } from "../../../components/leaderboard-retry-button";

export function LeaderboardError() {
  return (
    <section className="rounded-2xl border border-border bg-surface">
      <div
        role="alert"
        className="flex flex-col items-center gap-3 py-10 text-center"
      >
        <div>
          <p className="text-sm font-medium text-red-600 dark:text-red-400">
            Không tải được bảng xếp hạng
          </p>
          <p className="mt-1 text-sm text-muted">Mất kết nối tới máy chủ</p>
        </div>
        <LeaderboardRetryButton />
      </div>
    </section>
  );
}
