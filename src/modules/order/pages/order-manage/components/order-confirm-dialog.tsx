"use client";

import { ConfirmDialog } from "@/shared/components/common";
import { formatThoundsand } from "@/shared/utils";
import { BadgeCheck, Ban } from "lucide-react";
import { useEffect, useState } from "react";
import { OrderManagePendingAction } from "../../../types/order-manage.types";

interface OrderConfirmDialogProps {
  pendingAction: OrderManagePendingAction | null;
  isConfirming: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const strongClassName = "font-medium text-foreground";

/**
 * Hỏi lại trước khi duyệt hay từ chối một đơn, nói đúng hệ quả và số tiền đã
 * nhận. Duyệt là hộp trung tính; từ chối không đảo lại được nên hộp đỏ
 */
export function OrderConfirmDialog({
  pendingAction,
  isConfirming,
  onConfirm,
  onCancel,
}: OrderConfirmDialogProps) {
  // Giữ nội dung lúc mở trong khi hộp chạy hiệu ứng đóng, kẻo chữ chớp rỗng
  const [shownAction, setShownAction] = useState(pendingAction);

  useEffect(() => {
    if (pendingAction) setShownAction(pendingAction);
  }, [pendingAction]);

  if (!shownAction) return null;

  const { order, action } = shownAction;
  const studentName = order.student.name || order.student.email;
  const courseName = order.courseTitle || order.planName || "khoá đã mua";
  const isShortPaid = order.paidAmount > 0 && order.paidAmount < order.total;
  const isApprove = action === "approve";

  return (
    <ConfirmDialog
      isOpen={Boolean(pendingAction)}
      icon={isApprove ? BadgeCheck : Ban}
      tone={isApprove ? "neutral" : "danger"}
      title={
        isApprove ? `Duyệt đơn ${order.code}?` : `Từ chối đơn ${order.code}?`
      }
      description={
        <>
          {isApprove && (
            <>
              <span className={strongClassName}>{studentName}</span> được vào
              học <span className={strongClassName}>{courseName}</span> ngay.
              {isShortPaid && (
                <>
                  {" "}
                  Đơn mới nhận{" "}
                  <span className={strongClassName}>
                    {formatThoundsand(order.paidAmount)} đ
                  </span>{" "}
                  trên {formatThoundsand(order.total)} đ.
                </>
              )}
            </>
          )}
          {!isApprove && (
            <>
              Đơn của <span className={strongClassName}>{studentName}</span>{" "}
              đóng lại, không duyệt lại được. Muốn mua, học viên phải tạo đơn
              mới.
              {order.paidAmount > 0 && (
                <>
                  {" "}
                  Đơn đã nhận{" "}
                  <span className={strongClassName}>
                    {formatThoundsand(order.paidAmount)} đ
                  </span>
                  , nhớ hoàn tiền cho học viên.
                </>
              )}
            </>
          )}
        </>
      }
      confirmLabel={isApprove ? "Duyệt đơn" : "Từ chối đơn"}
      isConfirming={isConfirming}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
