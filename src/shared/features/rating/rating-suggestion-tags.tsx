"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils";
import {
  getRatingSuggestions,
  hasRatingSuggestion,
} from "@/shared/utils/rating.utils";
import { Check, Plus } from "lucide-react";

interface RatingSuggestionTagsProps {
  rating: number;
  content: string;
  onToggle: (suggestion: string) => void;
}

function getSuggestionTagClassName(isSelected: boolean) {
  return cn(
    "h-8 gap-1.5 rounded-full border px-3 text-xs font-medium",
    isSelected &&
      "border-primary bg-primary/10 text-primary hover:bg-primary/15",
    !isSelected &&
      "border-border-strong bg-surface text-muted hover:bg-button-hover hover:text-foreground",
  );
}

// Tag gợi ý dưới ô cảm nhận: bấm để chèn câu có sẵn, bấm lại để gỡ
export function RatingSuggestionTags({
  rating,
  content,
  onToggle,
}: RatingSuggestionTagsProps) {
  const suggestions = getRatingSuggestions(rating);

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {suggestions.map((suggestion) => {
        const isSelected = hasRatingSuggestion(content, suggestion);
        const TagIcon = isSelected ? Check : Plus;

        return (
          <Button
            key={suggestion}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onToggle(suggestion)}
            className={getSuggestionTagClassName(isSelected)}
          >
            <TagIcon className="size-3.5 shrink-0" />
            {suggestion}
          </Button>
        );
      })}
    </div>
  );
}
