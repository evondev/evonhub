import { MessageCircle } from "lucide-react";

/** Đầu khung nhắn Admin: nói trước là Admin trả lời khi rảnh, không phải ngay */
export function SupportPageHeader() {
  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <MessageCircle className="size-5 text-primary" aria-hidden />
      </div>
      <div className="min-w-0">
        <h1 className="text-base font-semibold text-foreground">Nhắn Admin</h1>
        <p className="text-pretty text-sm text-muted">
          Admin sẽ trả lời khi rảnh. Chỉ bạn và Admin đọc được tin nhắn này.
        </p>
      </div>
    </header>
  );
}
