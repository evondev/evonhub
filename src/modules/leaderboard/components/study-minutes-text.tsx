import { cn, formatThoundsand } from "@/shared/utils";

interface StudyMinutesTextProps {
  minutes: number;
  /** Cỡ, độ đậm của con số; chữ "phút" luôn mờ và thường */
  numberClassName?: string;
}

export function StudyMinutesText({
  minutes,
  numberClassName = "font-semibold",
}: StudyMinutesTextProps) {
  return (
    <>
      <span className={cn("tabular-nums text-foreground", numberClassName)}>
        {formatThoundsand(minutes)}
      </span>
      <span className="ml-1 font-normal text-muted">phút</span>
    </>
  );
}
