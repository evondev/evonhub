"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { suggestVideoTitles } from "@/shared/actions/ai";
import { AI_EMPTY_TITLE_MESSAGE } from "@/shared/constants/ai.constants";
import type {
  AiTitleSuggestion,
  AiVideoContext,
} from "@/shared/types/ai.types";
import { RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export interface AiTitleSuggestProps {
  context: AiVideoContext;
  onSelect: (title: string) => void;
}

/** Nút ✨ cạnh ô tiêu đề: mở ra 5 tiêu đề AI gợi ý, bấm cái nào điền cái đó */
export function AiTitleSuggest({ context, onSelect }: AiTitleSuggestProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [direction, setDirection] = useState("");
  const [suggestions, setSuggestions] = useState<AiTitleSuggestion[]>([]);

  async function generateSuggestions() {
    if (!context.title.trim()) {
      toast.error(AI_EMPTY_TITLE_MESSAGE);
      return;
    }

    setIsLoading(true);

    try {
      const result = await suggestVideoTitles({ ...context, direction });

      if (result.type === "error") {
        toast.error(result.message);
        return;
      }

      setSuggestions(result.data);
    } finally {
      setIsLoading(false);
    }
  }

  // Mở lần đầu thì gợi ý luôn, khỏi bấm thêm 1 lần
  function handleOpenChange(nextIsOpen: boolean) {
    setIsOpen(nextIsOpen);

    if (nextIsOpen && !suggestions.length && !isLoading) generateSuggestions();
  }

  function handleDirectionKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") return;

    event.preventDefault();
    generateSuggestions();
  }

  function handleSelect(title: string) {
    onSelect(title);
    setIsOpen(false);
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="-my-1.5 h-7 gap-1.5 px-2 text-xs text-primary-strong hover:text-primary-strong"
        >
          <Sparkles className="size-3.5" aria-hidden="true" />
          Gợi ý
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        collisionPadding={16}
        className="flex w-[440px] max-w-[calc(100vw-2rem)] flex-col gap-3 rounded-2xl border-border bg-surface p-4 text-foreground shadow-popover dark:border-border dark:bg-surface dark:text-foreground"
      >
        <div className="flex gap-2">
          <Input
            value={direction}
            onChange={(event) => setDirection(event.target.value)}
            onKeyDown={handleDirectionKeyDown}
            placeholder="Hướng thêm, ví dụ: hài hơn, ngắn hơn"
            className="h-9 text-sm"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            isLoading={isLoading}
            disabled={isLoading}
            onClick={generateSuggestions}
            className="shrink-0"
          >
            <RefreshCw className="size-3.5" aria-hidden="true" />
            Gợi ý lại
          </Button>
        </div>

        {isLoading && !suggestions.length && (
          <p className="py-6 text-center text-sm text-muted">
            AI đang nghĩ tiêu đề...
          </p>
        )}

        {!isLoading && !suggestions.length && (
          <p className="py-6 text-center text-sm text-muted">
            Nhập tiêu đề rồi bấm Gợi ý lại
          </p>
        )}

        {suggestions.length > 0 && (
          <ul className="flex flex-col gap-1" aria-busy={isLoading}>
            {suggestions.map((suggestion) => (
              <li key={suggestion.title}>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleSelect(suggestion.title)}
                  className="h-auto w-full flex-col items-start gap-1 px-3 py-2 text-left text-foreground"
                >
                  <span className="text-pretty text-sm font-medium">
                    {suggestion.title}
                  </span>
                  <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-xs text-primary-strong">
                    {suggestion.hook}
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
