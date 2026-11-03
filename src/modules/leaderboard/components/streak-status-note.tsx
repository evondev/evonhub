import { cn } from "@/shared/utils";
import { Check, Flame, Hourglass, PartyPopper, RotateCcw } from "lucide-react";
import { STREAK_STATUS_CLASS_NAMES } from "../constants";
import { StreakStatus } from "../types";

interface StreakStatusNoteProps {
  status: StreakStatus;
  current: number;
  /** "còn 2 giờ 20 phút", chỉ dùng khi hôm nay chưa học */
  todayRemainingLabel: string;
  className?: string;
}

/** Một câu nói chuỗi đang thế nào và cần làm gì hôm nay */
export function StreakStatusNote({
  status,
  current,
  todayRemainingLabel,
  className,
}: StreakStatusNoteProps) {
  return (
    <p
      className={cn(
        "flex items-start gap-2 rounded-xl p-3 text-sm font-medium",
        STREAK_STATUS_CLASS_NAMES[status],
        className,
      )}
    >
      {status === "new" && <Flame className="mt-0.5 size-4 shrink-0" />}
      {status === "risk" && <Hourglass className="mt-0.5 size-4 shrink-0" />}
      {status === "kept" && <Check className="mt-0.5 size-4 shrink-0" />}
      {status === "record" && (
        <PartyPopper className="mt-0.5 size-4 shrink-0" />
      )}
      {status === "broken" && <RotateCcw className="mt-0.5 size-4 shrink-0" />}
      <span className="text-pretty">
        {status === "new" && "Học ít nhất 1 phút mỗi ngày để bắt đầu chuỗi"}
        {status === "risk" &&
          `Hôm nay chưa học, ${todayRemainingLabel} để giữ chuỗi`}
        {status === "kept" && "Đã giữ chuỗi hôm nay. Mai gặp lại"}
        {status === "record" && `Kỷ lục mới: ${current} ngày liên tiếp`}
        {status === "broken" && "Chuỗi đã dừng. Học hôm nay để bắt đầu lại"}
      </span>
    </p>
  );
}
