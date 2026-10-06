import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils";

interface CourseFreeChipProps {
  isActive: boolean;
  onToggle: () => void;
}

/** Chip bật/tắt "Miễn phí": chưa chọn là viên mờ, chọn rồi tô màu nhấn */
export function CourseFreeChip({ isActive, onToggle }: CourseFreeChipProps) {
  return (
    <Button
      variant="ghost"
      aria-pressed={isActive}
      onClick={onToggle}
      className={cn(
        "h-9 shrink-0 rounded-full px-3.5 font-medium",
        isActive &&
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        !isActive &&
          "bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground",
      )}
    >
      Miễn phí
    </Button>
  );
}
