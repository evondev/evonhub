"use client";

import { MODERATION_SAVE_ERROR_MESSAGE } from "@/shared/constants/moderation.constants";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  OrderManageAction,
  OrderManagePendingAction,
  OrderManageRow,
} from "../types/order-manage.types";
import { buildOrderActionSuccessMessage } from "../utils/order-manage.utils";

interface UseOrderActionOptions {
  /** Gọi server (trang thật) hoặc giả lập (trang xem trước); trả false khi không lưu được */
  changeStatus: (
    order: OrderManageRow,
    action: OrderManageAction,
  ) => Promise<boolean>;
}

/** Duyệt / từ chối một đơn qua hộp xác nhận: mở hộp, chạy, toast, đóng hộp */
export function useOrderAction({ changeStatus }: UseOrderActionOptions) {
  const [pendingAction, setPendingAction] =
    useState<OrderManagePendingAction | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  async function handleConfirm() {
    if (!pendingAction || isConfirming) return;

    setIsConfirming(true);

    try {
      const isSaved = await changeStatus(
        pendingAction.order,
        pendingAction.action,
      );

      if (!isSaved) {
        toast.error(MODERATION_SAVE_ERROR_MESSAGE);
        return;
      }

      toast.success(
        buildOrderActionSuccessMessage(
          pendingAction.order,
          pendingAction.action,
        ),
      );
      setPendingAction(null);
    } finally {
      setIsConfirming(false);
    }
  }

  function handleCancel() {
    if (isConfirming) return;

    setPendingAction(null);
  }

  return {
    pendingAction,
    isConfirming,
    handleRequest: setPendingAction,
    handleConfirm,
    handleCancel,
  };
}
