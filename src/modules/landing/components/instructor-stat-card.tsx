import { ArrowUpRight } from "lucide-react";
import { cn } from "@/shared/utils";
import { GRID_TICK_CLASS_NAME } from "../constants";
import { InstructorStat } from "../types";
import { SpotlightOverlay } from "./spotlight-overlay";

interface InstructorStatCardProps {
  stat: InstructorStat;
}

/** Một con số của evondev, bấm mở kênh tương ứng ở tab mới */
export function InstructorStatCard({ stat }: InstructorStatCardProps) {
  return (
    <a
      href={stat.url}
      target="_blank"
      rel="noreferrer"
      className="group relative isolate flex flex-col gap-1 overflow-hidden p-6 sm:p-8"
    >
      <SpotlightOverlay />
      <span className="flex items-start justify-between gap-3">
        <span className="font-display text-3xl font-semibold tabular-nums tracking-tight text-foreground sm:text-4xl">
          {stat.value}
        </span>
        <ArrowUpRight className="size-4 shrink-0 text-muted transition-colors group-hover:text-violet-300" />
      </span>
      <span className={cn(GRID_TICK_CLASS_NAME, "text-sm text-muted")}>
        {stat.label}
      </span>
    </a>
  );
}
