import { cn } from "@/shared/utils";
import { MAX_BAR_HEIGHT_PERCENT } from "../constants";
import { WeeklyLessonCount } from "../types";
import { getWeekAxisLabel } from "../utils";

interface WeeklyLessonsChartProps {
  weeklyLessons?: WeeklyLessonCount[];
}

export function WeeklyLessonsChart({ weeklyLessons }: WeeklyLessonsChartProps) {
  const hasData = Boolean(weeklyLessons && weeklyLessons.length > 1);
  const weeks = weeklyLessons || [];
  const maxValue = Math.max(1, ...weeks.map((week) => week.value));

  return (
    <section className="flex min-w-0 flex-col rounded-2xl border border-border bg-surface p-4 sm:p-5">
      <header className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Bài hoàn thành mỗi tuần
        </h2>
        <p className="mt-0.5 text-xs text-muted">8 tuần gần nhất</p>
      </header>
      {!hasData && (
        <div className="grid h-44 place-items-center text-center text-sm text-muted">
          Chưa có số liệu theo tuần
        </div>
      )}
      {hasData && (
        <>
          <div
            className="flex h-44 items-end gap-2"
            role="img"
            aria-label="Số bài hoàn thành mỗi tuần, 8 tuần gần nhất"
          >
            {weeks.map((week) => (
              <div
                key={week.label}
                className="flex h-full flex-1 flex-col justify-end gap-1.5"
              >
                <p className="text-center text-xs font-medium tabular-nums text-muted">
                  {week.value}
                </p>
                {week.value > 0 && (
                  <div
                    className={cn(
                      "mx-auto w-full max-w-8 rounded-t-md",
                      week.isCurrent && "bg-primary/35",
                      !week.isCurrent && "bg-primary",
                    )}
                    style={{
                      height: `${(week.value / maxValue) * MAX_BAR_HEIGHT_PERCENT}%`,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2 border-t border-border pt-3">
            {weeks.map((week, index) => (
              <p
                key={week.label}
                className={cn(
                  "min-w-0 flex-1 whitespace-nowrap text-center text-xs",
                  week.isCurrent && "font-medium text-foreground",
                  !week.isCurrent && "text-muted",
                )}
              >
                {getWeekAxisLabel(week, index, weeks.length)}
              </p>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
