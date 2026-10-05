import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface PurgeRejectedButtonProps {
  onClick: () => void;
}

/** Nút ở tab Từ chối: mở hộp xác nhận xoá vĩnh viễn mọi mục đã từ chối */
export function PurgeRejectedButton({ onClick }: PurgeRejectedButtonProps) {
  return (
    // Xoá vĩnh viễn là mất dữ liệu: nền đỏ mờ, chữ đỏ, luôn hiện
    <Button
      variant="destructive"
      onClick={onClick}
      className="h-9 gap-1.5 whitespace-nowrap rounded-lg px-3 sm:h-8"
    >
      <Trash2 className="size-4" />
      Xoá vĩnh viễn tất cả
    </Button>
  );
}
