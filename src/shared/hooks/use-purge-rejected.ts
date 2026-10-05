"use client";

import { MODERATION_DELETE_ERROR_MESSAGE } from "@/shared/constants/moderation.constants";
import { ModerationResult } from "@/shared/types";
import { useState } from "react";
import { toast } from "react-toastify";

interface UsePurgeRejectedOptions {
  /** Gọi server (trang thật) hoặc giả lập (trang xem trước) */
  purge: () => Promise<ModerationResult>;
  /** Câu toast khi xong, ví dụ "Đã xoá vĩnh viễn 37 bình luận" */
  buildSuccessMessage: (count: number) => string;
}

/** Xoá vĩnh viễn mọi mục đã từ chối: luôn qua hộp xác nhận đỏ, xong thì toast */
export function usePurgeRejected({
  purge,
  buildSuccessMessage,
}: UsePurgeRejectedOptions) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPurging, setIsPurging] = useState(false);

  function handleOpenConfirm() {
    setIsConfirmOpen(true);
  }

  function handleCancel() {
    setIsConfirmOpen(false);
  }

  async function handleConfirm() {
    setIsPurging(true);

    try {
      const result = await purge();

      if (!result.isSuccess) {
        toast.error(result.message || MODERATION_DELETE_ERROR_MESSAGE);
        return;
      }

      toast.success(buildSuccessMessage(result.count || 0));
      setIsConfirmOpen(false);
    } catch {
      toast.error(MODERATION_DELETE_ERROR_MESSAGE);
    } finally {
      setIsPurging(false);
    }
  }

  return {
    isConfirmOpen,
    isPurging,
    handleOpenConfirm,
    handleCancel,
    handleConfirm,
  };
}

/** Mọi thứ trang duyệt cần từ usePurgeRejected */
export type PurgeRejectedState = ReturnType<typeof usePurgeRejected>;
