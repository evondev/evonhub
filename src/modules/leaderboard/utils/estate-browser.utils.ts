import { ESTATE_SEEN_TIER_STORAGE_KEY } from "../constants/estate.constants";

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
}

/** Máy yếu (≤ 4 nhân hay ≤ 4 GB RAM, trình duyệt báo): cảnh chạy chế độ nhẹ */
export function isLowPowerDevice(): boolean {
  const browserNavigator = navigator as NavigatorWithMemory;

  return (browserNavigator.hardwareConcurrency || 8) <= 4 || (browserNavigator.deviceMemory || 8) <= 4;
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Bậc máy này đã xem lần trước; null là chưa xem lần nào hay không đọc được bộ nhớ */
export function readSeenEstateTier(): number | null {
  try {
    const storedValue = window.localStorage.getItem(ESTATE_SEEN_TIER_STORAGE_KEY);

    if (storedValue === null) return null;

    const storedTier = Number(storedValue);

    return Number.isInteger(storedTier) ? storedTier : null;
  } catch {
    return null;
  }
}

export function writeSeenEstateTier(tierLevel: number): void {
  try {
    window.localStorage.setItem(ESTATE_SEEN_TIER_STORAGE_KEY, String(tierLevel));
  } catch {
    // Trình duyệt chặn bộ nhớ: lần sau không có cảnh lên bậc, trang vẫn chạy.
  }
}
