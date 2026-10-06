import { NotificationType } from "../constants/notification-type.constants";
import {
  NotificationGroup,
  NotificationItemData,
  NotificationMessagePart,
} from "../types";

/** Tên người trả lời, mới nhất trước, không trùng; thiếu tên thì bỏ qua */
function getUniqueActorNames(notifications: NotificationItemData[]) {
  const actorNames = notifications
    .map((notification) => notification.data?.actorName)
    .filter((actorName): actorName is string => Boolean(actorName));

  return Array.from(new Set(actorNames));
}

/** "A", "A và B", "A, B và 3 người khác" */
function getActorParts(actorNames: string[]): NotificationMessagePart[] {
  if (actorNames.length === 0) return [{ text: "Có người" }];

  if (actorNames.length === 1) {
    return [{ text: actorNames[0], isHighlight: true }];
  }

  if (actorNames.length === 2) {
    return [
      { text: actorNames[0], isHighlight: true },
      { text: " và " },
      { text: actorNames[1], isHighlight: true },
    ];
  }

  return [
    { text: actorNames[0], isHighlight: true },
    { text: ", " },
    { text: actorNames[1], isHighlight: true },
    { text: ` và ${actorNames.length - 2} người khác` },
  ];
}

/** Câu thông báo tách thành từng đoạn; đoạn isHighlight là tên người, khóa, bài */
export function getNotificationMessage(
  group: NotificationGroup,
): NotificationMessagePart[] {
  const { latest, items } = group;
  const { courseTitle = "", lessonTitle = "" } = latest.data ?? {};
  const itemCount = items.length;

  switch (latest.type) {
    case NotificationType.NewLesson:
      if (itemCount > 1) {
        return [
          { text: "Khóa học " },
          { text: courseTitle, isHighlight: true },
          { text: ` vừa có ${itemCount} bài học mới` },
        ];
      }

      return [
        { text: "Khóa học " },
        { text: courseTitle, isHighlight: true },
        { text: " vừa có bài học mới: " },
        { text: lessonTitle, isHighlight: true },
      ];
    case NotificationType.CourseEnrolled:
      return [
        { text: "Bạn đã đăng ký thành công khóa học " },
        { text: courseTitle, isHighlight: true },
      ];
    case NotificationType.CommentApproved:
      return [
        {
          text:
            itemCount > 1
              ? `${itemCount} bình luận của bạn tại bài học `
              : "Bình luận của bạn tại bài học ",
        },
        { text: lessonTitle, isHighlight: true },
        { text: " đã được duyệt" },
      ];
    case NotificationType.CommentReply:
      return [
        ...getActorParts(getUniqueActorNames(items)),
        { text: " đã trả lời bình luận của bạn tại bài học " },
        { text: lessonTitle, isHighlight: true },
      ];
    default:
      return [];
  }
}

/**
 * Trang mở ra khi bấm thông báo; nhóm thì mở theo thông báo mới nhất.
 * Thông báo cũ hoặc thiếu dữ liệu thì không có link.
 */
export function getNotificationLink(
  notification: NotificationItemData,
): string | undefined {
  const { courseSlug, lessonId, commentId } = notification.data ?? {};

  if (!courseSlug) return;

  switch (notification.type) {
    case NotificationType.NewLesson:
      return lessonId ? `/${courseSlug}/lesson?id=${lessonId}` : undefined;
    case NotificationType.CourseEnrolled:
      return `/study?khoa=${courseSlug}`;
    case NotificationType.CommentApproved:
    case NotificationType.CommentReply:
      if (!lessonId) return;

      return `/${courseSlug}/lesson?id=${lessonId}${commentId ? `#${commentId}` : ""}`;
    default:
      return;
  }
}

/** Chưa xem panel lần nào thì mọi thông báo đều chưa đọc */
export function isNotificationUnread(
  createdAt: string,
  seenAt: string | null,
): boolean {
  if (!seenAt) return true;

  return new Date(createdAt).getTime() > new Date(seenAt).getTime();
}
