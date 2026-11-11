import { Inbox } from "lucide-react";

/** Màn rộng chưa chọn hội thoại nào */
export function SupportConversationPlaceholder() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <Inbox className="size-8 text-muted" aria-hidden />
      <p className="mt-3 text-sm text-muted">
        Chọn một hội thoại để đọc. Trả lời hay không là tuỳ bạn.
      </p>
    </div>
  );
}
