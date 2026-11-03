import { cn } from "@/shared/utils";
import Image from "next/image";
import { STREAK_IMAGE_SRC } from "../constants";
import { StreakDayPoint } from "../types";

interface StreakDayDotsProps {
  days: StreakDayPoint[];
  className?: string;
}

/** Mỗi ngày một chấm: có học là ngọn lửa, hôm nay chưa học là vòng nét đứt */
export function StreakDayDots({ days, className }: StreakDayDotsProps) {
  return (
    <ol className={cn("grid grid-cols-7 gap-1", className)}>
      {days.map((day) => (
        <li key={day.key} className="flex flex-col items-center gap-1.5">
          {day.isStudied && (
            <span className="grid size-8 place-items-center rounded-full bg-orange-50 dark:bg-orange-500/10">
              <Image
                src={STREAK_IMAGE_SRC}
                alt="Có học"
                width={48}
                height={48}
                className="size-6"
              />
            </span>
          )}
          {!day.isStudied && (
            <span
              aria-label={day.isToday ? "Chưa học" : "Không học"}
              className={cn(
                "size-8 rounded-full",
                day.isToday &&
                  "border-2 border-dashed border-amber-500 dark:border-amber-400",
                !day.isToday && "bg-item-active",
              )}
            />
          )}
          <span
            className={cn(
              "text-xs",
              day.isToday && "font-semibold text-foreground",
              !day.isToday && "text-muted",
            )}
          >
            {day.isToday ? "Nay" : day.label}
          </span>
        </li>
      ))}
    </ol>
  );
}
