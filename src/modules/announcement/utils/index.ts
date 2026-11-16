import { INTERVIEW_PATH } from "@/modules/interview/constants";
import { BriefcaseBusiness, Home } from "lucide-react";
import { FEATURE_ANNOUNCEMENT_ID } from "@/shared/constants/announcement.constants";
import {
  FEATURE_ANNOUNCEMENT_STORAGE_KEY_PREFIX,
  HOUSE_PATH,
} from "../constants";
import { FeatureAnnouncementItem } from "../types";

/** Đường tới nhà của một người; tên có thể chứa ký tự đặc biệt nên phải mã hoá */
export function buildHousePath(username: string): string {
  return `${HOUSE_PATH}/${encodeURIComponent(username)}`;
}

/**
 * Hai tính năng mới trong hộp giới thiệu. Không có username thì không dựng được
 * đường tới nhà, bỏ thẻ đó thay vì dẫn vào trang lỗi
 */
export function buildFeatureAnnouncementItems(
  username: string | undefined,
): FeatureAnnouncementItem[] {
  const interviewItem: FeatureAnnouncementItem = {
    id: "interview",
    icon: BriefcaseBusiness,
    title: "Luyện phỏng vấn",
    description:
      "Bộ câu hỏi phỏng vấn theo từng khoá học, có giải thích ngay sau mỗi câu. Trả lời đúng ngay lần đầu được cộng điểm.",
    ctaLabel: "Luyện thử",
    href: INTERVIEW_PATH,
  };

  if (!username) return [interviewItem];

  const houseItem: FeatureAnnouncementItem = {
    id: "house",
    icon: Home,
    title: "Nhà của bạn",
    description:
      "Hòn đảo riêng lớn dần theo giờ học: từ lều cắm trại, xe đạp tới villa, siêu xe, du thuyền.",
    ctaLabel: "Xem nhà",
    href: buildHousePath(username),
  };

  return [interviewItem, houseItem];
}

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
