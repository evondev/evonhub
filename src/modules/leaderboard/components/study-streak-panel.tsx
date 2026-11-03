import { cn } from "@/shared/utils";
import Image from "next/image";
import { STREAK_IMAGE_SRC } from "../constants";
import { StudyStreak } from "../types";
import { getStreakStatus } from "../utils";
import { StreakDayDots } from "./streak-day-dots";
import { StreakStatusNote } from "./streak-status-note";

interface StudyStreakPanelProps {
  streak: StudyStreak;
  /** "còn 2 giờ 20 phút" tới hết hôm nay */
  todayRemainingLabel: string;
}

/**
 * Số ngày liên tiếp, 7 chấm gần nhất và hôm nay đã giữ chuỗi chưa. Nút học
 * tiếp đã có ở hero dashboard nên thẻ không lặp lại.
 */
export function StudyStreakPanel({
  streak,
  todayRemainingLabel,
}: StudyStreakPanelProps) {
  return (
    <section
      aria-label="Chuỗi ngày học"
      className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-5 lg:flex-row lg:items-center lg:gap-8"
    >
      <div className="flex items-center gap-3 lg:w-52 lg:shrink-0">
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
      <StreakDayDots days={streak.recentDays} className="lg:w-72 lg:shrink-0" />
      <StreakStatusNote
        status={getStreakStatus(streak)}
        current={streak.current}
        todayRemainingLabel={todayRemainingLabel}
        className="lg:flex-1"
      />
    </section>
  );
}
