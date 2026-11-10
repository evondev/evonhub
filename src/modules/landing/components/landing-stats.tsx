import { cn } from "@/shared/utils";
import { LANDING_CONTAINER_CLASS_NAME } from "../constants";
import { LandingStatItem } from "../types";
import { getStatsGridClassName } from "../utils";
import { LandingStatCell } from "./landing-stat-cell";

interface LandingStatsProps {
  statItems: LandingStatItem[];
}

/** Dải số liệu thật của nền tảng ngay dưới hero; chưa có số nào thì ẩn */
export function LandingStats({ statItems }: LandingStatsProps) {
  if (statItems.length === 0) return null;

  return (
    <section
      aria-label="Số liệu EvonHub"
      className={LANDING_CONTAINER_CLASS_NAME}
    >
      <div
        className={cn(
          "faded-grid reveal-on-scroll grid grid-cols-1",
          getStatsGridClassName(statItems.length),
        )}
      >
        {statItems.map((statItem) => (
          <LandingStatCell key={statItem.label} statItem={statItem} />
        ))}
      </div>
    </section>
  );
}
