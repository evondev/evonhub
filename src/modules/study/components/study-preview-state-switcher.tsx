import { cn } from "@/shared/utils";
import Link from "next/link";
import { PREVIEW_STUDY_STATE_LINKS } from "../constants";
import { StudyPreviewState } from "../types";

interface StudyPreviewStateSwitcherProps {
  currentState: StudyPreviewState;
}

export function StudyPreviewStateSwitcher({
  currentState,
}: StudyPreviewStateSwitcherProps) {
  return (
    <nav
      aria-label="Trạng thái xem trước"
      className="scroll-hidden flex items-center gap-2 overflow-x-auto whitespace-nowrap rounded-2xl border border-dashed border-foreground/15 p-3 text-sm"
    >
      <span className="mr-1 shrink-0 text-xs font-medium text-muted">
        Xem trước (chỉ ở dev):
      </span>
      {PREVIEW_STUDY_STATE_LINKS.map((stateLink) => {
        const isActive = stateLink.state === currentState;

        return (
          <Link
            key={stateLink.state}
            href={`?tt=${stateLink.state}`}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex h-8 shrink-0 items-center rounded-lg px-3 transition-colors",
              isActive && "bg-foreground/[0.12] font-medium text-foreground",
              !isActive &&
                "text-foreground/70 hover:bg-foreground/[0.08] hover:text-foreground",
            )}
          >
            {stateLink.label}
          </Link>
        );
      })}
    </nav>
  );
}
