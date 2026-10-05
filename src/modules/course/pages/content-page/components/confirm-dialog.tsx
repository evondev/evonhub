"use client";

import { Button } from "@/components/ui/button";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { LucideIcon } from "lucide-react";
import { useRef } from "react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  icon: LucideIcon;
  title: string;
  description: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  isConfirming: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// Hộp xác nhận việc nguy hiểm: icon đỏ cùng hàng tiêu đề, nút xác nhận nền đỏ mờ ở cuối.
// Mở ra tiêu điểm rơi vào nút Huỷ để Enter không xác nhận nhầm.
export function ConfirmDialog({
  isOpen,
  icon: Icon,
  title,
  description,
  confirmLabel,
  cancelLabel = "Huỷ",
  isConfirming,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  function handleOpenChange(isNextOpen: boolean) {
    if (!isNextOpen && !isConfirming) onCancel();
  }

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:duration-100 data-[state=open]:duration-150" />
        <DialogPrimitive.Content
          role="alertdialog"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            cancelButtonRef.current?.focus();
          }}
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-surface p-6 shadow-lg outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:duration-100 data-[state=open]:duration-150 data-[state=closed]:ease-in data-[state=open]:ease-out motion-reduce:data-[state=closed]:zoom-out-100 motion-reduce:data-[state=open]:zoom-in-100"
        >
          {/* Lưới hai cột: icon và tiêu đề cùng hàng; thân dưới sm trải hết bề rộng, từ sm thẳng mép tiêu đề */}
          <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-rose-500/10">
              <Icon
                className="size-5 text-rose-700 dark:text-rose-400"
                aria-hidden
              />
            </div>
            <DialogPrimitive.Title className="text-lg font-semibold text-foreground">
              {title}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description
              asChild
              className="col-span-2 mt-2 min-w-0 text-sm/6 text-muted sm:col-span-1 sm:col-start-2 sm:mt-0.5"
            >
              <div>{description}</div>
            </DialogPrimitive.Description>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              ref={cancelButtonRef}
              type="button"
              variant="secondary"
              className="h-11 md:h-10"
              disabled={isConfirming}
              onClick={onCancel}
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="h-11 md:h-10"
              isLoading={isConfirming}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
