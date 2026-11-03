import { cn } from "@/shared/utils";
import { Check, Flame, Hourglass, PartyPopper, RotateCcw } from "lucide-react";
import { STREAK_STATUS_CLASS_NAMES } from "../constants";
import { StreakStatus } from "../types";
import { getStreakStatusText } from "../utils";

interface StreakStatusNoteProps {
  status: StreakStatus;
  current: number;
  /** "còn 2 giờ 20 phút", chỉ dùng khi hôm nay chưa học */
  todayRemainingLabel: string;
  /** Thay câu mặc định của trạng thái, giữ màu và icon */
  message?: string;
  className?: string;
}

/** Một câu nói chuỗi đang thế nào và cần làm gì hôm nay */
export function StreakStatusNote({
  status,
  current,
  todayRemainingLabel,
  message,
  className,
}: StreakStatusNoteProps) {
  const text =
    message || getStreakStatusText(status, current, todayRemainingLabel);

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
      <span className="text-pretty">{text}</span>
    </p>
  );
}
