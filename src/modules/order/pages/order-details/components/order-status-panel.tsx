import { BADGE_TONE_CLASSES } from "@/shared/constants/common.constants";
import { BadgeTone } from "@/shared/types";
import { cn } from "@/shared/utils";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface OrderStatusPanelProps {
  icon: LucideIcon;
  tone: BadgeTone;
  title: string;
  description: ReactNode;
  actions?: ReactNode;
}

/** Khối thay chỗ thông tin chuyển khoản khi đơn không còn cần trả tiền */
export function OrderStatusPanel({
  icon: Icon,
  tone,
  title,
  description,
  actions,
}: OrderStatusPanelProps) {
  return (
    <section
      aria-labelledby="order-status-title"
      className="flex gap-4 rounded-2xl border border-border bg-surface p-4 sm:p-5"
    >
      <span
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl",
          BADGE_TONE_CLASSES[tone],
        )}
      >
        <Icon aria-hidden className="size-5" />
      </span>
      <div className="min-w-0 flex-1">
        <h2
          id="order-status-title"
          className="text-base font-semibold text-foreground"
        >
          {title}
        </h2>
        <p className="mt-1 max-w-[60ch] text-pretty text-sm text-muted">
          {description}
        </p>
        {actions && <div className="mt-4 flex flex-wrap gap-2">{actions}</div>}
      </div>
    </section>
  );
}
