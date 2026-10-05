"use client";

import { MODERATION_SAVE_ERROR_MESSAGE } from "@/shared/constants/moderation.constants";
import {
  ModerationAction,
  ModerationPendingChange,
  ModerationResult,
} from "@/shared/types";
import { useState } from "react";
import { toast } from "react-toastify";

export interface ModerationItem {
  id: string;
}

interface UseModerationOptions<TItem extends ModerationItem> {
  /** Gọi server (trang thật) hoặc giả lập (trang xem trước) với danh sách id */
  changeStatus: (
    itemIds: string[],
    action: ModerationAction,
  ) => Promise<ModerationResult>;
  /** Đổi mọi mục khớp bộ lọc đang xem, trừ các mục đã bỏ tick */
  changeMatchingStatus: (
    excludedIds: string[],
    action: ModerationAction,
  ) => Promise<ModerationResult>;
  /** Câu toast khi đổi theo danh sách, ví dụ "Đã duyệt bình luận của Vy" */
  buildSuccessMessage: (items: TItem[], action: ModerationAction) => string;
  /** Câu toast khi đổi theo bộ lọc, ví dụ "Đã từ chối 24 bình luận" */
  buildCountSuccessMessage: (count: number, action: ModerationAction) => string;
}

/**
 * Chọn mục và duyệt / từ chối trên trang duyệt. Hai việc đều đổi lại được nên
 * làm ngay, không qua hộp xác nhận. Xong thì toast và bỏ chọn các mục vừa đổi.
 *
 * Hai cách chọn: tick từng mục trên trang (selectedIds), hoặc "chọn cả bộ lọc"
 * (isAllMatchingSelected): mọi mục khớp bộ lọc kể cả trang khác, trừ excludedIds.
 */
export function useModeration<TItem extends ModerationItem>({
  changeStatus,
  changeMatchingStatus,
  buildSuccessMessage,
  buildCountSuccessMessage,
}: UseModerationOptions<TItem>) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAllMatchingSelected, setIsAllMatchingSelected] = useState(false);
  const [excludedIds, setExcludedIds] = useState<string[]>([]);
  const [pendingChange, setPendingChange] =
    useState<ModerationPendingChange | null>(null);

  function toggleId(currentIds: string[], itemId: string) {
    return currentIds.includes(itemId)
      ? currentIds.filter((currentId) => currentId !== itemId)
      : [...currentIds, itemId];
  }

  function isSelected(itemId: string): boolean {
    if (isAllMatchingSelected) return !excludedIds.includes(itemId);

    return selectedIds.includes(itemId);
  }

  /** Số mục đang chọn; chọn cả bộ lọc thì tính trên tổng số khớp bộ lọc */
  function getSelectedCount(matchingTotal: number): number {
    if (isAllMatchingSelected) return matchingTotal - excludedIds.length;

    return selectedIds.length;
  }

  function handleToggleSelect(itemId: string) {
    if (isAllMatchingSelected) {
      setExcludedIds((currentIds) => toggleId(currentIds, itemId));
      return;
    }

    setSelectedIds((currentIds) => toggleId(currentIds, itemId));
  }

  function handleClearSelection() {
    setSelectedIds([]);
    setIsAllMatchingSelected(false);
    setExcludedIds([]);
  }

  /** Đang chọn gì (một phần, cả trang hay cả bộ lọc) thì bỏ chọn hết, chưa chọn gì thì chọn cả trang */
  function handleToggleSelectAll(pageItemIds: string[]) {
    if (isAllMatchingSelected || selectedIds.length > 0) {
      handleClearSelection();
      return;
    }

    setSelectedIds(pageItemIds);
  }

  function handleSelectAllMatching() {
    setSelectedIds([]);
    setExcludedIds([]);
    setIsAllMatchingSelected(true);
  }

  async function runChange(
    change: ModerationPendingChange,
    request: () => Promise<ModerationResult>,
    buildMessage: (result: ModerationResult) => string,
    onSuccess: () => void,
  ) {
    if (pendingChange) return;

    setPendingChange(change);

    try {
      const result = await request();

      if (!result.isSuccess) {
        toast.error(result.message || MODERATION_SAVE_ERROR_MESSAGE);
        return;
      }

      toast.success(buildMessage(result));
      onSuccess();
    } catch {
      toast.error(MODERATION_SAVE_ERROR_MESSAGE);
    } finally {
      setPendingChange(null);
    }
  }

  async function handleChangeStatus(items: TItem[], action: ModerationAction) {
    if (items.length === 0) return;

    const itemIds = items.map((item) => item.id);

    await runChange(
      { itemIds, action, isAllMatching: false },
      () => changeStatus(itemIds, action),
      () => buildSuccessMessage(items, action),
      // Bỏ chọn đúng các mục vừa đổi; đang chọn cả bộ lọc thì mục đó cũng
      // không còn khớp tab nữa, giữ nguyên chế độ chọn
      () =>
        setSelectedIds((currentIds) =>
          currentIds.filter((currentId) => !itemIds.includes(currentId)),
        ),
    );
  }

  /** Đổi mọi mục khớp bộ lọc trừ các mục bỏ tick; xong thì bỏ chọn hết */
  async function handleChangeAllMatching(action: ModerationAction) {
    await runChange(
      { itemIds: [], action, isAllMatching: true },
      () => changeMatchingStatus(excludedIds, action),
      (result) => buildCountSuccessMessage(result.count || 0, action),
      handleClearSelection,
    );
  }

  /** Duyệt / từ chối các mục đang chọn, theo đúng cách đang chọn */
  async function handleChangeSelection(
    pageItems: TItem[],
    action: ModerationAction,
  ) {
    if (isAllMatchingSelected) {
      await handleChangeAllMatching(action);
      return;
    }

    await handleChangeStatus(
      pageItems.filter((item) => selectedIds.includes(item.id)),
      action,
    );
  }

  /** Việc đang chạy trên đúng mục này (nút của mục đó quay) */
  function getRunningAction(itemId: string): ModerationAction | undefined {
    if (!pendingChange || pendingChange.isAllMatching) return undefined;

    return pendingChange.itemIds.includes(itemId)
      ? pendingChange.action
      : undefined;
  }

  /** Việc hàng loạt đang chạy trên đúng các mục đang chọn (nút trên thanh quay) */
  function getBulkRunningAction(): ModerationAction | undefined {
    if (!pendingChange) return undefined;
    if (pendingChange.isAllMatching) return pendingChange.action;

    const isRunningOnSelection =
      selectedIds.length > 0 &&
      pendingChange.itemIds.length === selectedIds.length &&
      selectedIds.every((itemId) => pendingChange.itemIds.includes(itemId));

    return isRunningOnSelection ? pendingChange.action : undefined;
  }

  return {
    selectedIds,
    isAllMatchingSelected,
    isChanging: Boolean(pendingChange),
    isSelected,
    getSelectedCount,
    getRunningAction,
    getBulkRunningAction,
    handleToggleSelect,
    handleToggleSelectAll,
    handleSelectAllMatching,
    handleClearSelection,
    handleChangeStatus,
    handleChangeSelection,
  };
}

/** Mọi thứ trang duyệt cần từ useModeration: mục đã chọn, việc đang chạy, các handler */
export type ModerationState<TItem extends ModerationItem> = ReturnType<
  typeof useModeration<TItem>
>;
