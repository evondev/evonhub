import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FeatureAnnouncementItem } from "../types";

interface FeatureAnnouncementCardProps {
  item: FeatureAnnouncementItem;
  onNavigate: () => void;
}

/** Cả thẻ là một link: bấm chỗ nào cũng đi, đóng hộp trước khi chuyển trang */
export function FeatureAnnouncementCard({
  item,
  onNavigate,
}: FeatureAnnouncementCardProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className="group flex gap-4 rounded-xl border border-border p-4 transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-base font-semibold text-foreground">
          {item.title}
        </span>
        <span className="text-pretty text-sm/6 text-muted">
          {item.description}
        </span>
        <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary-strong">
          {item.ctaLabel}
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
            aria-hidden
          />
        </span>
      </span>
    </Link>
  );
}
