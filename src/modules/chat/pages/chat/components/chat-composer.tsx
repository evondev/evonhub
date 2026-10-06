"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/shared/utils";
import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  CHAT_MESSAGE_COUNTER_THRESHOLD,
  CHAT_MESSAGE_MAX_LENGTH,
  CHAT_RATE_LIMIT_MESSAGE,
  CHAT_SEND_INTERVAL_MS,
} from "../../../constants";
import {
  getChatContentError,
  insertTextAtSelection,
  resizeComposer,
} from "../../../utils";
import { ChatConversationStarters } from "./chat-conversation-starters";
import { ChatEmojiPicker } from "./chat-emoji-picker";

interface ChatComposerProps {
  /** Phòng chưa có tin: hiện câu mở lời trên ô soạn */
  isRoomEmpty: boolean;
  /** Trang xem trước dựng sẵn trạng thái bị chặn */
  initialDraft?: string;
  initialError?: string;
  /** Trả về lỗi nếu chưa gửi được, null là đã gửi */
  onSend: (content: string) => Promise<string | null>;
}

/**
 * Ô soạn tin dính đáy khung: Enter gửi, Shift+Enter xuống dòng. Xoá ô ngay khi
 * gửi; server từ chối thì trả nội dung lại (nếu ô còn trống) kèm lý do.
 */
export function ChatComposer({
  isRoomEmpty,
  initialDraft = "",
  initialError = "",
  onSend,
}: ChatComposerProps) {
  const [draft, setDraft] = useState(initialDraft);
  const [error, setError] = useState(initialError);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastSentAtRef = useRef(0);
  const isCounterVisible = draft.length >= CHAT_MESSAGE_COUNTER_THRESHOLD;
  const canSend = draft.trim().length > 0;

  // Ô nhập đổi nội dung bằng code (chèn emoji, xoá sau khi gửi) cũng phải co giãn
  useEffect(() => {
    resizeComposer(textareaRef.current);
  }, [draft]);

  /** Kiểm nội dung và nhịp gửi; trả về false nếu chưa gửi được */
  function validateBeforeSend(content: string): boolean {
    const contentError = getChatContentError(content);

    if (contentError) {
      setError(contentError);
      return false;
    }

    if (Date.now() - lastSentAtRef.current < CHAT_SEND_INTERVAL_MS) {
      setError(CHAT_RATE_LIMIT_MESSAGE);
      return false;
    }

    return true;
  }

  async function sendContent(content: string) {
    lastSentAtRef.current = Date.now();
    setError("");

    const sendError = await onSend(content);

    if (!sendError) return;

    setError(sendError);
    setDraft((currentDraft) => currentDraft || content);
  }

  function submitDraft() {
    if (!validateBeforeSend(draft)) return;

    const content = draft;

    setDraft("");
    sendContent(content);
  }

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    submitDraft();
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
    submitDraft();
  }

  function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setDraft(event.target.value);

    if (error) setError("");
  }

  function handleStarterSelect(starter: string) {
    if (!validateBeforeSend(starter)) return;

    sendContent(starter);
  }

  function handleEmojiSelect(symbol: string) {
    const textarea = textareaRef.current;
    const selectionStart = textarea?.selectionStart ?? draft.length;
    const selectionEnd = textarea?.selectionEnd ?? draft.length;
    const nextCursor = selectionStart + symbol.length;

    setDraft(
      insertTextAtSelection(draft, symbol, selectionStart, selectionEnd),
    );

    // Đợi React ghi giá trị mới vào ô rồi mới đặt con trỏ sau emoji
    requestAnimationFrame(() => {
      textarea?.focus();
      textarea?.setSelectionRange(nextCursor, nextCursor);
    });
  }

  return (
    <div className="shrink-0 px-3 pb-3 sm:px-4 sm:pb-4">
      {isRoomEmpty && <ChatConversationStarters onSelect={handleStarterSelect} />}
      <form
        onSubmit={handleSubmit}
        className={cn(
          "relative flex items-end gap-1 rounded-3xl border bg-surface p-2 transition-colors",
          error && "border-rose-500/60",
          !error &&
            "border-border-strong focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15",
        )}
      >
        <ChatEmojiPicker onSelect={handleEmojiSelect} />
        <textarea
          ref={textareaRef}
          rows={1}
          value={draft}
          maxLength={CHAT_MESSAGE_MAX_LENGTH}
          placeholder="Nhắn cho mọi người…"
          aria-label="Tin nhắn"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "chat-composer-error" : undefined}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="max-h-40 min-h-10 flex-1 resize-none bg-transparent px-1 py-2 text-base text-foreground outline-none placeholder:text-muted"
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
      {(error || isCounterVisible) && (
        <div className="mt-1.5 flex items-start justify-between gap-3 px-3 text-sm">
          <p
            id="chat-composer-error"
            role="alert"
            className="text-rose-600 dark:text-rose-400"
          >
            {error}
          </p>
          {isCounterVisible && (
            <span className="shrink-0 text-xs tabular-nums text-muted">
              {draft.length}/{CHAT_MESSAGE_MAX_LENGTH}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
