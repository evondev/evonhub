import { ViewAllLink } from "@/shared/components/common";
import { UserAvatar } from "@/shared/components/common/user-avatar";
import { cn } from "@/shared/utils";
import Image from "next/image";
import {
  LEADERBOARD_PATH,
  STREAK_IMAGE_SRC,
  WEEK_PROGRESS_EMPTY_MESSAGE,
} from "../constants";
import { StudyStreak, WeekLeaderboardSummary } from "../types";
import { getStreakStatus } from "../utils";
import { StreakDayDots } from "./streak-day-dots";
import { StreakStatusNote } from "./streak-status-note";
import { WeekStandingText } from "./week-standing-text";

interface WeekProgressViewProps {
  streak: StudyStreak;
  summary: WeekLeaderboardSummary;
  /** "còn 2 giờ 20 phút" tới hết hôm nay */
  todayRemainingLabel: string;
}

/**
 * Panel "Tuần này" cạnh hero dashboard: chuỗi ngày học, 7 chấm gần nhất, rồi
 * phút và hạng tuần. Một cột cạnh hero ở màn rộng, hai cột ở màn vừa.
 */
export function WeekProgressView({
  streak,
  summary,
  todayRemainingLabel,
}: WeekProgressViewProps) {
  const status = getStreakStatus(streak);
  const { standing, topEntries } = summary;
  // Chưa từng học và tuần này chưa có phút: một câu cho cả chuỗi lẫn bảng
  const isFreshStart = status === "new" && standing.rank === 0;

  return (
    <section
      aria-label="Tuần này"
      className="grid min-w-0 grid-cols-1 content-start gap-5 rounded-2xl border border-border bg-surface p-5 md:grid-cols-2 xl:flex xl:flex-col"
    >
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-foreground">Tuần này</h2>
          <ViewAllLink href={LEADERBOARD_PATH} text="Bảng xếp hạng" />
        </div>
        <div className="flex items-center gap-3">
          <Image
            src={STREAK_IMAGE_SRC}
            alt=""
            width={96}
            height={96}
            className={cn(
              "size-12 shrink-0",
              streak.current === 0 && "opacity-50 grayscale",
            )}
          />
          <div className="min-w-0">
            <p className="font-display text-3xl font-bold leading-none tabular-nums text-foreground">
              {streak.current}{" "}
              <span className="font-sans text-sm font-medium text-muted">
                ngày liên tiếp
              </span>
            </p>
            {streak.longest > 0 && (
              <p className="mt-1 text-xs text-muted">
                Kỷ lục {streak.longest} ngày
              </p>
            )}
          </div>
        </div>
        <StreakDayDots days={streak.recentDays} />
      </div>
      <div className="flex min-w-0 flex-col gap-4 border-t border-border pt-5 md:border-l md:border-t-0 md:pl-5 md:pt-0 xl:flex-1 xl:border-l-0 xl:border-t xl:pl-0 xl:pt-5">
        <StreakStatusNote
          status={status}
          current={streak.current}
          todayRemainingLabel={todayRemainingLabel}
          message={isFreshStart ? WEEK_PROGRESS_EMPTY_MESSAGE : undefined}
        />
        {!isFreshStart && (
          <div className="min-w-0">
            <WeekStandingText standing={standing} />
          </div>
        )}
        {/* Panel giãn cao bằng hero ở màn rộng: hàng này dạt xuống đáy thay vì để trống */}
        {!isFreshStart && topEntries.length > 0 && (
          <div className="flex items-center gap-2 xl:mt-auto">
            <div className="flex -space-x-2">
              {topEntries.map((entry) => (
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
              Top {topEntries.length} tuần
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
