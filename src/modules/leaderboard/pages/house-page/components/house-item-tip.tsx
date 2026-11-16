import { STUDY_TIERS } from "../../../constants";
import { EstatePickedItem } from "../../../types/estate.types";
import { formatStudyDuration, getStudyTierByLevel } from "../../../utils";

interface HouseItemTipProps {
  item: EstatePickedItem;
  totalSeconds: number;
}

/** Nhãn nhỏ cạnh chỗ bấm: tên món, bậc mở; món bậc kế thêm còn bao lâu */
export function HouseItemTip({ item, totalSeconds }: HouseItemTipProps) {
  const tier = getStudyTierByLevel(item.tier);
  const tierMinSeconds = STUDY_TIERS.find((studyTier) => studyTier.level === item.tier)?.minSeconds || 0;
  const detail = item.isGhost
    ? `Mở ở bậc ${item.tier} ${tier?.name || ""} · còn ${formatStudyDuration(tierMinSeconds - totalSeconds, true)}`
    : `Mở ở bậc ${item.tier} ${tier?.name || ""}`;

  return (
    <div
      role="status"
      className="pointer-events-none absolute z-10 max-w-60 rounded-xl border border-border bg-surface/95 px-3 py-2 text-sm shadow-sm backdrop-blur"
      style={{ left: Math.max(8, item.clientX + 12), top: Math.max(8, item.clientY - 56) }}
    >
      <p className="font-medium text-foreground">{item.name}</p>
      <p className="text-xs text-muted">{detail}</p>
    </div>
  );
}
