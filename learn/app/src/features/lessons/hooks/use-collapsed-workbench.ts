"use client";

import { useCallback, useSyncExternalStore } from "react";

const COLLAPSED_STORAGE_KEY = "learn:workbench-collapsed";
const collapsedListeners = new Set<() => void>();
// Trình duyệt chặn localStorage (ẩn danh) thì nhớ tạm trong bộ nhớ, công tắc vẫn bấm được.
let collapsedFallback = false;

function subscribeCollapsed(listener: () => void) {
  collapsedListeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    collapsedListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function readCollapsedSnapshot() {
  try {
    return window.localStorage.getItem(COLLAPSED_STORAGE_KEY) === "1";
  } catch {
    return collapsedFallback;
  }
}

// Server không có localStorage: luôn render bàn làm việc đang mở, trình duyệt đọc lại sau khi hydrate.
function readServerCollapsedSnapshot() {
  return false;
}

function writeCollapsed(isCollapsed: boolean) {
  collapsedFallback = isCollapsed;

  try {
    window.localStorage.setItem(COLLAPSED_STORAGE_KEY, isCollapsed ? "1" : "0");
  } catch {
    // Không lưu được thì chỉ mất ghi nhớ cho lần mở sau.
  }

  collapsedListeners.forEach((listener) => listener());
}

// Bàn làm việc gập hay mở, nhớ qua các lần mở trang.
export function useCollapsedWorkbench() {
  const isCollapsed = useSyncExternalStore(subscribeCollapsed, readCollapsedSnapshot, readServerCollapsedSnapshot);
  const toggleCollapsed = useCallback(() => writeCollapsed(!readCollapsedSnapshot()), []);

  return { isCollapsed, toggleCollapsed };
}
