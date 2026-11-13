import { Button } from "@/components/ui/button";
import { MessageCircleQuestion } from "lucide-react";
import Link from "next/link";

export function InterviewCoursesEmpty() {
  return (
    <section className="flex max-w-3xl flex-col items-center gap-3 rounded-2xl border border-dashed border-border-strong bg-surface px-4 py-12 text-center">
      <span className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary-strong">
        <MessageCircleQuestion className="size-6" />
      </span>
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Khóa bạn mua chưa có câu luyện phỏng vấn
        </h2>
        <p className="mx-auto mt-1 max-w-[46ch] text-pretty text-sm text-muted">
          Câu hỏi được thêm dần theo từng khóa. Khóa nào có câu mới sẽ hiện ở
          đây.
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href="/study">Về Khu vực học tập</Link>
      </Button>
    </section>
  );
}
