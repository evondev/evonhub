import { Button } from "@/components/ui/button";
import {
  COMING_SOON_CHANNEL_LABEL,
  COMING_SOON_CHANNEL_URL,
} from "@/shared/constants/common.constants";
import { Bell, BookOpen } from "lucide-react";

export function StudyEmpty() {
  return (
    <section className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border-strong bg-surface px-4 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary-strong">
        <BookOpen className="size-6" />
      </span>
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Bạn chưa có khóa học nào
        </h2>
        <p className="mt-1 max-w-[46ch] text-pretty text-sm text-muted">
          Khóa mới về AI cho người mới và vibe coding đang được chuẩn bị. Theo
          dõi để biết khi có khóa mở.
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
