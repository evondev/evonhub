/** Loại thông báo: quyết định câu hiển thị, icon và link khi bấm */
export enum NotificationType {
  NewLesson = "new-lesson",
  CourseEnrolled = "course-enrolled",
  CommentApproved = "comment-approved",
  CommentReply = "comment-reply",
}

/** Thông báo cũ hơn 90 ngày thì MongoDB tự xoá (TTL index trên createdAt) */
export const NOTIFICATION_TTL_SECONDS = 90 * 24 * 60 * 60;

/** Kênh private riêng của từng người: private-notifications-<userId> */
export const NOTIFICATION_CHANNEL_PREFIX = "private-notifications-";

/** Sự kiện chỉ báo "có thông báo mới", không mang nội dung; client tự tải lại */
export const NOTIFICATION_PUSHER_EVENT = "notification:new";

/** Pusher nhận tối đa 100 kênh trong một lần trigger */
export const PUSHER_MAX_CHANNELS_PER_TRIGGER = 100;
