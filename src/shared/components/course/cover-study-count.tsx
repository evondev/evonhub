import { formatCompactCount } from "@/shared/helpers";
import { cn } from "@/shared/utils";
import { GraduationCap } from "lucide-react";

interface CoverStudyCountProps {
  count?: number;
  className?: string;
}

/**
 * Lượt học ở góc dưới trái ảnh bìa. Ảnh có khi chỉ rộng hơn 100px nên chỉ ghi
 * số kèm icon, chữ "lượt học" để cho trình đọc màn hình và tooltip. Chưa ai
 * học thì ẩn, không khoe con số 0
 */
export function CoverStudyCount({
  count = 0,
  className,
}: CoverStudyCountProps) {
  if (count <= 0) return null;

  const compactCount = formatCompactCount(count);
  const studyCountLabel = `${compactCount} lượt học`;

  return (
    <span
      title={studyCountLabel}
      className={cn(
        "absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-black/75 px-1.5 py-0.5 text-xs font-medium tabular-nums text-white",
        className,
      )}
    >
      <GraduationCap className="size-3.5 shrink-0" aria-hidden />
      <span aria-hidden>{compactCount}</span>
      <span className="sr-only">{studyCountLabel}</span>
    </span>
  );
}
