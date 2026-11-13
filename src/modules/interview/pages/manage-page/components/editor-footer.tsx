import { Button } from "@/components/ui/button";
import { Sparkles, Trash2 } from "lucide-react";

interface EditorFooterProps {
  isNew: boolean;
  isPublished: boolean;
  isSaving: boolean;
  isRegenerating: boolean;
  isUnpublishing: boolean;
  onDelete: () => void;
  onRegenerate: () => void;
  onUnpublish: () => void;
  onSave: (shouldPublish: boolean) => void;
}

/** Hàng nút dính đáy khung soạn: form dài, nút Đăng không trôi mất dưới cùng */
export function EditorFooter({
  isNew,
  isPublished,
  isSaving,
  isRegenerating,
  isUnpublishing,
  onDelete,
  onRegenerate,
  onUnpublish,
  onSave,
}: EditorFooterProps) {
  const isBusy = isSaving || isRegenerating || isUnpublishing;

  return (
    <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-2 border-t border-border bg-surface px-4 py-3 sm:px-5">
      {isNew ? (
        <span />
      ) : (
        <Button variant="destructive" disabled={isBusy} onClick={onDelete}>
          <Trash2 className="size-4" />
          Xoá
        </Button>
      )}
      <div className="flex gap-2">
        {!isNew && (
          <Button
            variant="outline"
            className="px-3 sm:px-4"
            aria-label="Tạo lại câu này"
            disabled={isBusy}
            isLoading={isRegenerating}
            onClick={onRegenerate}
          >
            <Sparkles className="size-4" />
            <span className="hidden sm:inline">Tạo lại câu này</span>
          </Button>
        )}
        {isPublished ? (
          <>
            <Button variant="outline" disabled={isBusy} isLoading={isUnpublishing} onClick={onUnpublish}>
              Gỡ đăng
            </Button>
            <Button variant="primary" className="px-6" disabled={isBusy} isLoading={isSaving} onClick={() => onSave(false)}>
              Lưu
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" disabled={isBusy} onClick={() => onSave(false)}>
              Lưu nháp
            </Button>
            <Button variant="primary" className="px-6" disabled={isBusy} isLoading={isSaving} onClick={() => onSave(true)}>
              Đăng
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
