import {
  FEATURE_ANNOUNCEMENT_ID,
  IS_FEATURE_ANNOUNCEMENT_ENABLED,
} from "../constants/announcement.constants";

interface AnnouncementViewer {
  seenAnnouncements?: string[];
}

/**
 * Người này còn chưa xem đợt giới thiệu tính năng mới. Hộp góp ý cũng đọc để
 * nhường phiên đó, không bật hai hộp chồng nhau. Đang tắt thì coi như không còn
 * gì để xem: hộp không bật, hộp góp ý cũng khỏi nhường
 */
export function isFeatureAnnouncementPending(
  viewer: AnnouncementViewer | null | undefined,
): boolean {
  if (!IS_FEATURE_ANNOUNCEMENT_ENABLED || !viewer) return false;

  return !viewer.seenAnnouncements?.includes(FEATURE_ANNOUNCEMENT_ID);
}
