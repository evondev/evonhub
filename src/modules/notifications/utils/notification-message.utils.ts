import { NotificationType } from "../constants/notification-type.constants";
import { NotificationItemData, NotificationMessagePart } from "../types";

/** Câu thông báo tách thành từng đoạn; đoạn isHighlight là tên khóa, tên bài */
export function getNotificationMessage(
  notification: NotificationItemData,
): NotificationMessagePart[] {
  const { courseTitle = "", lessonTitle = "" } = notification.data ?? {};

  switch (notification.type) {
    case NotificationType.NewLesson:
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
        { text: "Bình luận của bạn tại bài học " },
        { text: lessonTitle, isHighlight: true },
        { text: " đã được duyệt" },
      ];
    default:
      return [];
  }
}

/** Trang mở ra khi bấm thông báo; thông báo cũ hoặc thiếu dữ liệu thì không có link */
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
