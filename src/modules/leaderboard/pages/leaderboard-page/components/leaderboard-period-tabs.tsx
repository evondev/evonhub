import { cn } from "@/shared/utils";
import Link from "next/link";
import { LEADERBOARD_PERIOD_TABS } from "../../../constants";
import { LeaderboardPeriod } from "../../../types";
import {
  getLeaderboardPeriodHref,
  getPeriodResetLabel,
} from "../../../utils";

interface LeaderboardPeriodTabsProps {
  period: LeaderboardPeriod;
}

/** Ba kỳ là ba link (?period=), kèm câu nói khi nào bảng tính lại */
export function LeaderboardPeriodTabs({ period }: LeaderboardPeriodTabsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      {/* Rãnh nằm trên nền trang xám nên dùng lớp phủ foreground/5, không bg-background */}
      <nav
        aria-label="Kỳ xếp hạng"
        className="inline-flex w-fit max-w-full gap-1 rounded-xl bg-foreground/5 p-1 shadow-segment-track"
      >
        {LEADERBOARD_PERIOD_TABS.map((tab) => {
          const isSelected = tab.value === period;

          return (
            <Link
              key={tab.value}
              href={getLeaderboardPeriodHref(tab.value)}
              aria-current={isSelected ? "page" : undefined}
              className={cn(
                "inline-flex h-8 items-center whitespace-nowrap rounded-lg px-3 text-sm transition-[color,background-color,box-shadow] duration-150",
                isSelected &&
                  "bg-surface font-medium text-foreground shadow-segment-thumb",
                !isSelected && "text-foreground/75 hover:text-foreground",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
      <p className="text-pretty text-sm text-muted">
        {getPeriodResetLabel(period)}
      </p>
    </div>
  );
}
