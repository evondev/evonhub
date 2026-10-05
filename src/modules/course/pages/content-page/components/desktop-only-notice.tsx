import { Button } from "@/components/ui/button";
import { Monitor } from "lucide-react";
import Link from "next/link";

// Dưới lg không đủ chỗ cho cột outline và ô soạn nội dung: báo rõ thay vì để trang trắng
export function DesktopOnlyNotice() {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-border bg-surface px-5 py-10 text-center lg:hidden">
      <div className="grid size-10 place-items-center rounded-full bg-background">
        <Monitor className="size-5 text-foreground" aria-hidden />
      </div>
      <p className="mt-4 text-base font-semibold text-foreground">
        Mở trên máy tính để soạn nội dung
      </p>
      <p className="mt-1 max-w-[40ch] text-pretty text-sm text-muted">
        Kéo thả bài học và ô soạn nội dung cần màn hình rộng từ 1024px.
      </p>
      <Button asChild variant="outline" className="mt-5">
        <Link href="/admin/course/manage">Về quản lý khóa học</Link>
      </Button>
    </div>
  );
}
