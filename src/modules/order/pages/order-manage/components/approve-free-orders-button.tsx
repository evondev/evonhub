import { Button } from "@/components/ui/button";
import { cn, formatThoundsand } from "@/shared/utils";
import { BadgeCheck } from "lucide-react";

interface ApproveFreeOrdersButtonProps {
  /** Số đơn 0 đồng đang chờ, ghi luôn trên nút */
  count: number;
  onClick: () => void;
  className?: string;
}

/** Mở hộp xác nhận duyệt một lượt mọi đơn 0 đồng đang chờ, chỉ admin */
export function ApproveFreeOrdersButton({
  count,
  onClick,
  className,
}: ApproveFreeOrdersButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      // Nút nằm thẳng trên nền trang xám: rê vào chỉ đậm viền, đổi nền thì nút tan vào nền
      className={cn("hover:border-foreground/25 hover:bg-surface", className)}
    >
      <BadgeCheck className="size-4 shrink-0" />
      Duyệt {formatThoundsand(count)} đơn miễn phí
    </Button>
  );
}
