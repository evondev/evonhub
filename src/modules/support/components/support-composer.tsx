"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils";
import { resizeComposer } from "@/shared/utils/composer.utils";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  SUPPORT_MESSAGE_COUNTER_THRESHOLD,
  SUPPORT_MESSAGE_MAX_LENGTH,
  SUPPORT_RATE_LIMIT_MESSAGE,
  SUPPORT_SEND_INTERVAL_MS,
} from "../constants";
import { getSupportContentError } from "../utils";

interface SupportComposerProps {
  placeholder: string;
  /** Khoá ô nhập (vd đã gửi đủ số tin chưa được đáp) kèm câu giải thích */
  disabledMessage?: string;
  /** Trả về lỗi nếu chưa gửi được, null là đã gửi */
  onSend: (content: string) => Promise<string | null>;
}

/**
 * Ô soạn tin dính đáy khung: Enter gửi, Shift+Enter xuống dòng. Xoá ô ngay khi
 * gửi; server từ chối thì trả nội dung lại (nếu ô còn trống) kèm lý do.
 */
export function SupportComposer({
  placeholder,
  disabledMessage,
  onSend,
}: SupportComposerProps) {
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastSentAtRef = useRef(0);
  const isDisabled = Boolean(disabledMessage);
  const isCounterVisible = draft.length >= SUPPORT_MESSAGE_COUNTER_THRESHOLD;
  const canSend = !isDisabled && draft.trim().length > 0;
  const hintMessage = error || disabledMessage;

  // Ô nhập đổi nội dung bằng code (xoá sau khi gửi) cũng phải co giãn
  useEffect(() => {
    resizeComposer(textareaRef.current);
  }, [draft]);

  async function submitDraft() {
    const contentError = getSupportContentError(draft);

    if (contentError) {
      setError(contentError);
      return;
    }

    if (Date.now() - lastSentAtRef.current < SUPPORT_SEND_INTERVAL_MS) {
      setError(SUPPORT_RATE_LIMIT_MESSAGE);
      return;
    }

    const content = draft;

    lastSentAtRef.current = Date.now();
    setDraft("");
    setError("");

    const sendError = await onSend(content);

    if (!sendError) return;

    setError(sendError);
    setDraft((currentDraft) => currentDraft || content);
  }

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    if (canSend) void submitDraft();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    // isComposing: đang gõ dấu tiếng Việt (Telex/VNI), Enter là để chốt chữ
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return;
    }

    event.preventDefault();

    if (canSend) void submitDraft();
  }

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setDraft(event.target.value);

    if (error) setError("");
  }

  return (
    <div className="shrink-0 px-3 pb-3 sm:px-4 sm:pb-4">
      <form
        onSubmit={handleSubmit}
        className={cn(
          "relative flex items-end gap-1 rounded-3xl border bg-surface p-2 pl-3 transition-colors",
          error && "border-rose-500/60",
          isDisabled && !error && "border-border opacity-60",
          !error &&
            !isDisabled &&
            "border-border-strong focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15",
        )}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={draft}
          disabled={isDisabled}
          maxLength={SUPPORT_MESSAGE_MAX_LENGTH}
          placeholder={placeholder}
          aria-label="Tin nhắn"
          aria-invalid={Boolean(error)}
          aria-describedby={hintMessage ? "support-composer-hint" : undefined}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-1 py-2 text-base text-foreground outline-none placeholder:text-muted disabled:cursor-not-allowed"
        />
        <Button
          type="submit"
          variant="primary"
          aria-label="Gửi"
          disabled={!canSend}
          className="size-10 shrink-0 rounded-2xl px-0 disabled:opacity-30"
        >
          <ArrowUp className="size-4" />
        </Button>
      </form>
      {(hintMessage || isCounterVisible) && (
        <div className="mt-1.5 flex items-start justify-between gap-3 px-3 text-sm">
          <p
            id="support-composer-hint"
            role={error ? "alert" : undefined}
            className={cn(
              error && "text-rose-600 dark:text-rose-400",
              !error && "text-muted",
            )}
          >
            {hintMessage}
          </p>
          {isCounterVisible && (
            <span className="shrink-0 text-xs tabular-nums text-muted">
              {draft.length}/{SUPPORT_MESSAGE_MAX_LENGTH}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
