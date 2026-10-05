import { cn } from "@/shared/utils";
import { LearningStatTile } from "../types";

interface LearningStatRowProps {
  tiles: LearningStatTile[];
}

export function LearningStatRow({ tiles }: LearningStatRowProps) {
  return (
    <section className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border lg:grid-cols-4">
      {tiles.map((tile) => (
        <div key={tile.label} className="min-w-0 bg-surface p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <p className="text-balance text-xs font-medium text-muted">
              {tile.label}
            </p>
            <span
              className={cn(
                "grid size-8 shrink-0 place-items-center rounded-lg",
                tile.iconClassName,
              )}
            >
              <tile.icon className="size-4" />
            </span>
          </div>
          <p className="mt-1 text-xl font-semibold tabular-nums text-foreground sm:text-2xl">
            {tile.value}
          </p>
          <p className="mt-1 truncate text-xs text-muted" title={tile.note}>
            {tile.note}
          </p>
        </div>
      ))}
    </section>
  );
}
