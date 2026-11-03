import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils";

interface CourseFilterChipProps {
  label: string;
  isActive: boolean;
  onToggle: () => void;
}

/** Chip bật/tắt một bộ lọc ("Miễn phí", "Video"): chưa chọn là viên mờ, chọn rồi tô màu nhấn */
export function CourseFilterChip({
  label,
  isActive,
  onToggle,
}: CourseFilterChipProps) {
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
      {label}
    </Button>
  );
}
