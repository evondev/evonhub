import { FEATURE_ANNOUNCEMENT_ID } from "@/shared/constants/announcement.constants";
import { FEATURE_ANNOUNCEMENT_STORAGE_KEY_PREFIX } from "../constants";

function getAnnouncementStorageKey(userId: string): string {
  return `${FEATURE_ANNOUNCEMENT_STORAGE_KEY_PREFIX}:${FEATURE_ANNOUNCEMENT_ID}:${userId}`;
}

/** Trình duyệt này đã bật hộp cho người này chưa. Không đọc được storage thì coi như chưa */
export function hasSeenAnnouncementLocally(userId: string): boolean {
  try {
    return localStorage.getItem(getAnnouncementStorageKey(userId)) === "1";
  } catch {
    return false;
  }
}

export function markAnnouncementSeenLocally(userId: string) {
  try {
    localStorage.setItem(getAnnouncementStorageKey(userId), "1");
  } catch {
    // Storage bị chặn: còn mốc trên server, không ảnh hưởng gì khác
  }
}
