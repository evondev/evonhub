"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils";
import { ChatReactionSummary } from "../../../types";
import { describeReactionChip } from "../../../utils";

interface ChatMessageReactionsProps {
  summaries: ChatReactionSummary[];
  /** Tin mình nằm bên phải nên chip dồn về mép phải */
  isOwnMessage: boolean;
  onReact: (emoji: string) => void;
}

/**
 * Chip reaction dưới bong bóng: emoji kèm số người thả. Chip mình đã thả tô
 * màu nhấn; bấm chip để thả cùng emoji, bấm lại chip của mình để gỡ
 */
export function ChatMessageReactions({
  summaries,
  isOwnMessage,
  onReact,
}: ChatMessageReactionsProps) {
  if (summaries.length === 0) return null;

  return (
    <div
      className={cn("mt-1 flex flex-wrap gap-1", isOwnMessage && "justify-end")}
    >
      {summaries.map((summary) => (
        <Button
          key={summary.emoji}
          type="button"
          aria-pressed={summary.hasViewerReacted}
          aria-label={describeReactionChip(summary)}
          className={cn(
            "h-6 gap-1 rounded-full border px-2 text-xs tabular-nums",
            summary.hasViewerReacted &&
              "border-primary/40 bg-primary/10 text-primary-strong hover:bg-primary/15",
            !summary.hasViewerReacted &&
              "border-border-strong bg-surface text-muted hover:bg-button-hover hover:text-foreground",
          )}
          onClick={() => onReact(summary.emoji)}
        >
          <span className="text-sm leading-none" aria-hidden>
            {summary.emoji}
          </span>
          {summary.count}
        </Button>
      ))}
    </div>
  );
}
