import { Check } from "lucide-react";
import type { RoadmapItemStatus } from "../types/roadmap";

interface RoadmapStatusBadgeProps {
  status: RoadmapItemStatus;
}

const statusLabels: Record<RoadmapItemStatus, string> = {
  "dang-lam": "Đang làm",
  xong: "Xong",
  "chua-lam": "Chưa làm",
  "chua-viet": "Chưa viết",
};

export default function RoadmapStatusBadge({ status }: RoadmapStatusBadgeProps) {
  if (status === "dang-lam") {
    return (
      <span className="inline-flex shrink-0 items-center rounded-full bg-primary-light px-2 py-0.5 text-xs font-medium text-primary-hover">
        {statusLabels[status]}
      </span>
    );
  }

  if (status === "xong") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
        <Check className="size-3.5" aria-hidden />
        {statusLabels[status]}
      </span>
    );
  }

  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-background px-2 py-0.5 text-xs font-medium text-muted">
      {statusLabels[status]}
    </span>
  );
}
