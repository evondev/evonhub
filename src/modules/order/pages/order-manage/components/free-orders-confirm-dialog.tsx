"use client";

import { ConfirmDialog } from "@/shared/components/common";
import { formatThoundsand } from "@/shared/utils";
import { BadgeCheck } from "lucide-react";
import { useEffect, useState } from "react";

interface FreeOrdersConfirmDialogProps {
  isOpen: boolean;
  /** Số đơn 0 đồng đang chờ lúc mở hộp */
  count: number;
  isConfirming: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Hộp trung tính trước khi duyệt một lượt mọi đơn 0 đồng đang chờ, nói rõ số đơn */
export function FreeOrdersConfirmDialog({
  isOpen,
  count,
  isConfirming,
  onConfirm,
  onCancel,
}: FreeOrdersConfirmDialogProps) {
  // Giữ số lúc mở trong khi hộp chạy hiệu ứng đóng: duyệt xong số về 0, chữ chớp
  const [shownCount, setShownCount] = useState(count);
  const countLabel = formatThoundsand(shownCount);

  useEffect(() => {
    if (isOpen) setShownCount(count);
  }, [isOpen, count]);

  return (
    <ConfirmDialog
      isOpen={isOpen}
      icon={BadgeCheck}
      tone="neutral"
      title={`Duyệt ${countLabel} đơn miễn phí?`}
      description={
        <>
          Học viên của{" "}
          <span className="font-medium text-foreground">
            {countLabel} đơn 0 đồng
          </span>{" "}
          đang chờ được vào học ngay. Áp cho mọi đơn miễn phí đang chờ, không
          theo từ khoá đang tìm.
        </>
      }
      confirmLabel={`Duyệt ${countLabel} đơn`}
      isConfirming={isConfirming}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
