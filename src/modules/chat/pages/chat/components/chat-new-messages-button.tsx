import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

interface ChatNewMessagesButtonProps {
  count: number;
  onClick: () => void;
}

/** Đang kéo lên đọc tin cũ mà có tin mới: bấm để xuống cuối */
export function ChatNewMessagesButton({
  count,
  onClick,
}: ChatNewMessagesButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="absolute bottom-3 left-1/2 z-10 h-8 -translate-x-1/2 gap-1.5 rounded-full px-3 shadow-md"
    >
      <ArrowDown className="size-4" />
      {count} tin mới
    </Button>
  );
}
