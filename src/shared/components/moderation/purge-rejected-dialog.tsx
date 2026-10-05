"use client";

import { ConfirmDialog } from "@/shared/components/common";
import { formatThoundsand } from "@/shared/utils";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

interface PurgeRejectedDialogProps {
  isOpen: boolean;
  /** Số mục đã từ chối khớp bộ lọc đang xem */
  count: number;
  /** Đơn vị trong câu, ví dụ "bình luận" */
  itemLabel: string;
  /** Hệ quả riêng của loại mục này, ví dụ xoá kèm câu trả lời */
  consequence: string;
  isPurging: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Hộp xác nhận đỏ trước khi xoá vĩnh viễn mọi mục đã từ chối, nói rõ số mục */
export function PurgeRejectedDialog({
  isOpen,
  count,
  itemLabel,
  consequence,
  isPurging,
  onConfirm,
  onCancel,
}: PurgeRejectedDialogProps) {
  // Giữ số lúc mở trong khi hộp chạy hiệu ứng đóng: xoá xong số về 0, chữ chớp
  const [shownCount, setShownCount] = useState(count);

  useEffect(() => {
    if (isOpen) setShownCount(count);
  }, [isOpen, count]);

  return (
    <ConfirmDialog
      isOpen={isOpen}
      icon={Trash2}
      title={`Xoá vĩnh viễn ${formatThoundsand(shownCount)} ${itemLabel} đã từ chối?`}
      description={<>{consequence} Không khôi phục được.</>}
      confirmLabel="Xoá vĩnh viễn"
      isConfirming={isPurging}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
