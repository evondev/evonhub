import { Button } from "@/components/ui/button";
import { cn, getFilterChipClassName } from "@/shared/utils";

interface FreeOrderChipProps {
  isActive: boolean;
  onToggle: () => void;
  className?: string;
}

/** Chip bật tắt: chỉ xem đơn 0 đồng. Cùng dáng chip lọc ở trang Khoá học */
export function FreeOrderChip({
  isActive,
  onToggle,
  className,
}: FreeOrderChipProps) {
  return (
    <Button
      aria-pressed={isActive}
      onClick={onToggle}
      className={cn(getFilterChipClassName(isActive), className)}
    >
      Miễn phí
    </Button>
  );
}
