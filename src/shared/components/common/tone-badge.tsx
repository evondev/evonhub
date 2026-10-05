import { BADGE_TONE_CLASSES } from "@/shared/constants/common.constants";
import { BadgeTone } from "@/shared/types";
import { cn } from "@/shared/utils";

interface ToneBadgeProps {
  tone: BadgeTone;
  label: string;
  className?: string;
}

/** Badge trạng thái: chấm màu + chữ trên nền nhạt cùng tông */
export function ToneBadge({ tone, label, className }: ToneBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ring-black/5 dark:ring-white/10",
        BADGE_TONE_CLASSES[tone],
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
