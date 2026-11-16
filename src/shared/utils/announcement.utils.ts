import { FEATURE_ANNOUNCEMENT_ID } from "../constants/announcement.constants";

interface AnnouncementViewer {
  seenAnnouncements?: string[];
}

/**
 * Người này còn chưa xem đợt giới thiệu tính năng mới. Hộp góp ý cũng đọc để
 * nhường phiên đó, không bật hai hộp chồng nhau
 */
export function isFeatureAnnouncementPending(
  viewer: AnnouncementViewer | null | undefined,
): boolean {
  if (!viewer) return false;

  return !viewer.seenAnnouncements?.includes(FEATURE_ANNOUNCEMENT_ID);
}
