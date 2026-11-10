import Link from "next/link";
import { LandingStatItem } from "../types";
import { CountUpValue } from "./count-up-value";
import { SpotlightOverlay } from "./spotlight-overlay";

interface LandingStatCellProps {
  statItem: LandingStatItem;
}

const STAT_CELL_CLASS_NAME =
  "group relative isolate block overflow-hidden bg-surface p-6 sm:p-8";

/** Một ô số liệu; ô có url thì bấm được và rê vào đổi nền */
export function LandingStatCell({ statItem }: LandingStatCellProps) {
  const cellContent = (
    <>
      <SpotlightOverlay />
      <p className="font-display text-4xl font-semibold tabular-nums tracking-tight text-foreground sm:text-5xl">
        <CountUpValue value={statItem.value} format={statItem.format} />
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">
        {statItem.label}
      </p>
      <p className="mt-1 text-sm text-muted transition-colors group-hover:text-primary">
        {statItem.hint}
      </p>
    </>
  );

  if (statItem.url) {
    return (
      <Link href={statItem.url} className={STAT_CELL_CLASS_NAME}>
        {cellContent}
      </Link>
    );
  }

  return <div className={STAT_CELL_CLASS_NAME}>{cellContent}</div>;
}
