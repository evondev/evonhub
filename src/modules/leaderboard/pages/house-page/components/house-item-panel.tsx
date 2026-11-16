import { cn } from "@/shared/utils";

import { TierBadge } from "../../../components/tier-badge";
import { ESTATE_LIST_ROWS } from "../../../constants/estate.constants";
import { getEstateHouse, getOwnedListItemName } from "../../../utils/estate.utils";

interface HouseItemPanelProps {
  tierLevel: number;
}

/** Danh sách món trên đảo: huy hiệu bậc mở ở bên trái, bậc chưa tới thì xám */
export function HouseItemPanel({ tierLevel }: HouseItemPanelProps) {
  const house = getEstateHouse(tierLevel);

  return (
    <aside className="pointer-events-auto w-64 rounded-2xl border border-border bg-surface/90 p-3 shadow-sm backdrop-blur">
      <h2 className="px-1 pb-2 text-xs font-semibold text-muted">
        Nhà: {house ? house.name : "bãi đất trống"}
      </h2>
      <ul className="flex flex-col gap-1">
        {ESTATE_LIST_ROWS.map((row) => {
          const isUnlocked = tierLevel >= row.tier;
          const isNext = row.tier === tierLevel + 1;

          return (
            <li
              key={row.listId}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-1.5 py-1 text-sm",
                isUnlocked && "text-foreground",
                !isUnlocked && "text-muted",
                isNext && "bg-primary/10",
              )}
            >
              <TierBadge level={row.tier} isLocked={!isUnlocked} className="size-7" />
              <span className="truncate">{getOwnedListItemName(row.listId, tierLevel) || row.name}</span>
              <span className="ml-auto shrink-0 text-xs tabular-nums text-muted">bậc {row.tier}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
