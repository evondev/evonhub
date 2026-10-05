import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface OutlineChapterTitleEditProps {
  initialTitle: string;
  isSaving: boolean;
  onSave: (title: string) => void;
  onCancel: () => void;
}

export function OutlineChapterTitleEdit({
  initialTitle,
  isSaving,
  onSave,
  onCancel,
}: OutlineChapterTitleEditProps) {
  const [title, setTitle] = useState(initialTitle);
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.select();
  }, []);

  function handleSave() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setHasError(true);
      inputRef.current?.focus();
      return;
    }
    if (trimmedTitle === initialTitle) {
      onCancel();
      return;
    }

    onSave(trimmedTitle);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    // Enter lúc bộ gõ đang gạch chân chữ là chốt chữ tiếng Việt, không phải lưu
    if (event.key === "Enter" && !event.nativeEvent.isComposing) {
      event.preventDefault();
      handleSave();
    }
    if (event.key === "Escape") {
      event.stopPropagation();
      onCancel();
    }
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
    if (hasError) setHasError(false);
  }

  return (
    <div className="py-3 pl-5 pr-3">
      <div className="flex items-center gap-1">
        <input
          ref={inputRef}
          value={title}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          enterKeyHint="done"
          aria-label="Tên chương"
          aria-invalid={hasError || undefined}
          className="form-styles h-10 min-w-0 flex-1 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/10"
        />
        {/* preventDefault ở mousedown: không thì ô blur trước, mà blur là lưu, bấm Huỷ thành lưu */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Lưu tên chương"
          title="Lưu (Enter)"
          className="size-8 shrink-0 rounded-lg"
          isLoading={isSaving}
          onMouseDown={(event) => event.preventDefault()}
          onClick={handleSave}
        >
          <Check className="size-4" aria-hidden />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Huỷ đổi tên"
          title="Huỷ (Esc)"
          className="size-8 shrink-0 rounded-lg"
          onMouseDown={(event) => event.preventDefault()}
          onClick={onCancel}
        >
          <X className="size-4" aria-hidden />
        </Button>
      </div>
      {hasError && (
        <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
          Chưa nhập tên chương
        </p>
      )}
    </div>
  );
}
