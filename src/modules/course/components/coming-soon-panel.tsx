import { Button } from "@/components/ui/button";
import { Bell, Clapperboard } from "lucide-react";
import {
  COMING_SOON_CHANNEL_LABEL,
  COMING_SOON_CHANNEL_URL,
} from "@/shared/constants/common.constants";

interface ComingSoonPanelProps {
  /** Neo để link "#khoa-hoc" ở dashboard cuộn tới */
  id?: string;
}

/** Chỗ của danh sách khóa học khi chưa có khóa nào public */
export function ComingSoonPanel({ id }: ComingSoonPanelProps) {
  return (
    <section
      id={id}
      className="flex scroll-mt-20 lg:scroll-mt-24 flex-col items-center gap-3 rounded-2xl border border-dashed border-border-strong bg-surface px-4 py-10 text-center"
    >
      <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary-strong">
        <Clapperboard className="size-6" />
      </span>
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Khóa mới đang được quay
        </h2>
        <p className="mt-1 max-w-[46ch] text-pretty text-sm text-muted">
          Các khóa về AI cho người mới và vibe coding đang được chuẩn bị, ngắn
          hơn và ít video hơn. Theo dõi để biết khi có khóa mở.
        </p>
      </div>
      <Button asChild variant="primary">
        <a
          href={COMING_SOON_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Bell className="size-4 shrink-0" />
          {COMING_SOON_CHANNEL_LABEL}
        </a>
      </Button>
    </section>
  );
}
