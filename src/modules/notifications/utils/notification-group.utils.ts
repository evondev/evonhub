import { NotificationType } from "../constants/notification-type.constants";
import { NotificationGroup, NotificationItemData } from "../types";
import { isNotificationUnread } from "./notification-message.utils";

/**
 * Đối tượng chung để gộp: bài học mới theo khóa, trả lời theo bình luận gốc,
 * bình luận được duyệt theo bài học. Không gộp được thì undefined.
 */
function getGroupTarget(notification: NotificationItemData) {
  const { courseSlug, lessonId, parentCommentId } = notification.data ?? {};

  switch (notification.type) {
    case NotificationType.NewLesson:
      return courseSlug;
    case NotificationType.CommentReply:
      return parentCommentId;
    case NotificationType.CommentApproved:
      return lessonId;
    default:
      return;
  }
}

/**
 * Gộp thông báo cùng loại, cùng đối tượng thành một dòng, đặt ở vị trí cái mới
 * nhất. Chưa đọc và đã đọc không gộp chung, để chấm chưa đọc vẫn đúng.
 * Danh sách vào phải xếp mới nhất trước.
 */
export function groupNotifications(
  notifications: NotificationItemData[],
  seenAt: string | null,
): NotificationGroup[] {
  const groups: NotificationGroup[] = [];
  const groupByKey = new Map<string, NotificationGroup>();

  for (const notification of notifications) {
    const isUnread = isNotificationUnread(notification.createdAt, seenAt);
    const groupTarget = getGroupTarget(notification);
    const groupKey = groupTarget
      ? `${notification.type}:${groupTarget}:${isUnread}`
      : notification._id;
    const existingGroup = groupByKey.get(groupKey);

    if (existingGroup) {
      existingGroup.items.push(notification);
      continue;
    }

    const group: NotificationGroup = {
      key: groupKey,
      latest: notification,
      items: [notification],
      isUnread,
    };

    groupByKey.set(groupKey, group);
    groups.push(group);
  }

  return groups;
}
