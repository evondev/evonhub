import { UserAvatar } from "@/shared/components/common/user-avatar";
import { Trophy } from "lucide-react";
import Link from "next/link";
import { LEADERBOARD_PATH } from "../constants";
import { getWeekLeaderboardSummary } from "../services/leaderboard.service";
import { LeaderboardRetryButton } from "./leaderboard-retry-button";
import { WeekStandingText } from "./week-standing-text";

interface WeekLeaderboardStripProps {
  userId: string;
}

/**
 * Khối "Tuần này" ngay dưới hero dashboard: phút, hạng, khoảng cách tới người
 * trên và lối sang trang Xếp hạng. Đọc ở server, nằm trong Suspense riêng nên
 * không giữ cả dashboard chờ.
 */
export async function WeekLeaderboardStrip({
  userId,
}: WeekLeaderboardStripProps) {
  const summary = await getWeekLeaderboardSummary(userId).catch((error) => {
    console.log("[leaderboard] Đọc xếp hạng tuần lỗi:", error);

    return undefined;
  });

  if (!summary) {
    return (
      <section
        role="alert"
        className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <p className="text-sm">
          <span className="font-medium text-red-600 dark:text-red-400">
            Không tải được xếp hạng tuần này.
          </span>{" "}
          <span className="text-muted">Mất kết nối tới máy chủ</span>
        </p>
        <LeaderboardRetryButton size="sm" />
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 sm:flex-row sm:items-center">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary-strong">
        <Trophy className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <WeekStandingText standing={summary.standing} />
      </div>
      <div className="flex shrink-0 items-center justify-between gap-4">
        {summary.topEntries.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {summary.topEntries.map((entry) => (
                <span
                  key={entry.userId}
                  title={entry.name}
                  className="rounded-full ring-2 ring-surface"
                >
                  <UserAvatar name={entry.name} avatar={entry.avatar} />
                </span>
              ))}
            </div>
            <span className="whitespace-nowrap text-xs text-muted">
              Top {summary.topEntries.length} tuần
            </span>
          </div>
        )}
        <Link
          href={LEADERBOARD_PATH}
          className="inline-flex h-8 items-center whitespace-nowrap text-sm font-medium text-foreground/70 hover:underline"
        >
          Xem bảng xếp hạng
        </Link>
      </div>
    </section>
  );
}
