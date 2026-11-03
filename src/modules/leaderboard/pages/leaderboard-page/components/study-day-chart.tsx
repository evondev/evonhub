import { cn } from "@/shared/utils";
import { StudyDayPoint } from "../../../types";

interface StudyDayChartProps {
  studyDays: StudyDayPoint[];
}

/** Phần trăm chiều cao vùng vẽ dành cho cột; phần còn lại chừa cho số trên đầu cột */
const BAR_AREA_PERCENT = 70;

/**
 * Cột phút học từng ngày, số trên đầu mỗi cột. Hôm nay chưa hết nên cột nhạt:
 * cột thấp không đọc ra "hôm nay tụt". Ngày 0 phút không có cột, chỉ ghi 0.
 */
export function StudyDayChart({ studyDays }: StudyDayChartProps) {
  const maxMinutes = Math.max(1, ...studyDays.map((studyDay) => studyDay.minutes));
  const peakDay = studyDays.reduce((peak, studyDay) =>
    studyDay.minutes > peak.minutes ? studyDay : peak,
  );

  return (
    <div
      role="img"
      aria-label={`Phút học ${studyDays.length} ngày gần nhất, nhiều nhất ${peakDay.minutes} phút`}
    >
      <div className="flex h-28 items-end gap-1.5">
        {studyDays.map((studyDay) => (
          <div
            key={studyDay.key}
            className="flex h-full flex-1 flex-col justify-end gap-1"
          >
            <p className="text-center text-xs font-medium tabular-nums text-muted">
              {studyDay.minutes}
            </p>
            {studyDay.minutes > 0 && (
              <div
                className={cn(
                  "mx-auto w-full max-w-6 rounded-t-md",
                  studyDay.isToday && "bg-primary/35",
                  !studyDay.isToday && "bg-primary",
                )}
                style={{
                  height: `${Math.round((studyDay.minutes / maxMinutes) * BAR_AREA_PERCENT)}%`,
                }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1.5 border-t border-border pt-2">
        {studyDays.map((studyDay) => (
          <p
            key={studyDay.key}
            className="flex-1 whitespace-nowrap text-center text-xs text-muted"
          >
            {studyDay.label}
          </p>
        ))}
      </div>
    </div>
  );
}
