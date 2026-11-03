"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { suggestVideoDescription } from "@/shared/actions/ai";
import {
  AI_DESCRIPTION_LENGTH_OPTIONS,
  AI_EMPTY_TITLE_MESSAGE,
} from "@/shared/constants/ai.constants";
import type {
  AiDescriptionLength,
  AiVideoContext,
} from "@/shared/types/ai.types";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export interface AiDescriptionDialogProps {
  context: AiVideoContext;
  /** HTML đang có trong editor */
  currentDescription: string;
  onApply: (descriptionHtml: string) => void;
}

/** Viết mô tả bằng AI từ tiêu đề, xem trước rồi mới thay hoặc chèn vào editor */
export function AiDescriptionDialog({
  context,
  currentDescription,
  onApply,
}: AiDescriptionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [length, setLength] = useState<AiDescriptionLength>("short");
  const [descriptionHtml, setDescriptionHtml] = useState("");
  const hasCurrentDescription = Boolean(currentDescription.trim());

  async function generateDescription() {
    if (!context.title.trim()) {
      toast.error(AI_EMPTY_TITLE_MESSAGE);
      return;
    }

    setIsLoading(true);

    try {
      const result = await suggestVideoDescription({ ...context, length });

      if (result.type === "error") {
        toast.error(result.message);
        return;
      }

      setDescriptionHtml(result.data);
    } finally {
      setIsLoading(false);
    }
  }

  function handleApply(shouldAppend: boolean) {
    onApply(
      shouldAppend ? currentDescription + descriptionHtml : descriptionHtml,
    );
    setIsOpen(false);
    setDescriptionHtml("");
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 text-primary-strong"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          Viết bằng AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] max-w-xl gap-0 overflow-y-auto rounded-2xl border-border bg-surface p-5 dark:border-border dark:bg-surface">
        <DialogTitle className="text-lg font-semibold text-foreground">
          Viết mô tả bằng AI
        </DialogTitle>
        <DialogDescription className="mb-4 mt-1 text-pretty text-sm text-muted">
          Dựa trên tiêu đề: <strong>{context.title || "chưa có"}</strong>
        </DialogDescription>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          {AI_DESCRIPTION_LENGTH_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={option.value === length ? "secondary" : "ghost"}
              aria-pressed={option.value === length}
              onClick={() => setLength(option.value)}
            >
              {option.label}
              <span className="text-xs font-normal text-muted">
                {option.hint}
              </span>
            </Button>
          ))}
          <Button
            type="button"
            variant="primary"
            size="sm"
            isLoading={isLoading}
            disabled={isLoading}
            onClick={generateDescription}
            className="ml-auto"
          >
            {descriptionHtml ? "Viết lại" : "Viết"}
          </Button>
        </div>

        <div className="min-h-32 rounded-xl border border-border p-4 text-sm leading-relaxed text-foreground [&_li]:mt-1 [&_p+p]:mt-2 [&_p+ul]:mt-2 [&_ul+p]:mt-2 [&_ul]:list-disc [&_ul]:pl-5">
          {descriptionHtml ? (
            // HTML đã sanitize ở server action
            <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
          ) : (
            <p className="text-muted">
              {isLoading
                ? "AI đang viết..."
                : "Chọn độ dài rồi bấm Viết, xem trước ở đây."}
            </p>
          )}
        </div>

        {descriptionHtml && (
          <div className="mt-4 flex justify-end gap-2">
            {hasCurrentDescription && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleApply(true)}
              >
                Chèn cuối mô tả cũ
              </Button>
            )}
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => handleApply(false)}
            >
              {hasCurrentDescription ? "Thay mô tả cũ" : "Dùng mô tả này"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
