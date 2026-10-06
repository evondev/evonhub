import { formatThoundsand } from "@/shared/utils";

interface PersonalStatsProps {
  score: number;
  courseCount: number;
}

/** Một khung, kẻ chia bằng khe 1px lộ nền viền: hai ô cao bằng nhau */
export function PersonalStats({ score, courseCount }: PersonalStatsProps) {
  const statItems = [
    { label: "Điểm", value: formatThoundsand(score) },
    { label: "Khóa đang học", value: formatThoundsand(courseCount) },
  ];

  return (
    <div className="lg:w-[22rem] lg:shrink-0">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
        {statItems.map((statItem) => (
          <div key={statItem.label} className="min-w-0 bg-surface p-4 sm:p-5">
            <p className="text-xs font-medium text-muted">{statItem.label}</p>
            <p className="mt-1 text-xl font-semibold tracking-tight tabular-nums text-foreground sm:text-2xl">
              {statItem.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
