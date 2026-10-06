import {
  Bell,
  BookOpen,
  GraduationCap,
  MessageSquareReply,
  MessageSquareText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { NotificationType } from "./notification-type.constants";

/** Nhãn nguồn ở dòng thời gian, thay cho title "Hệ thống" của thông báo cũ */
export const notificationTypeLabels: Record<NotificationType, string> = {
  [NotificationType.NewLesson]: "Bài học mới",
  [NotificationType.CourseEnrolled]: "Khóa học",
  [NotificationType.CommentApproved]: "Bình luận",
  [NotificationType.CommentReply]: "Trả lời",
};

export const notificationTypeIcons: Record<NotificationType, LucideIcon> = {
  [NotificationType.NewLesson]: BookOpen,
  [NotificationType.CourseEnrolled]: GraduationCap,
  [NotificationType.CommentApproved]: MessageSquareText,
  [NotificationType.CommentReply]: MessageSquareReply,
};

/** Icon của thông báo cũ chưa có loại */
export const LEGACY_NOTIFICATION_ICON: LucideIcon = Bell;

/** Số dòng khung chờ lúc panel thông báo đang tải */
export const NOTIFICATION_SKELETON_ROW_COUNT = 3;

/** Danh sách cao tối đa 28rem */
export const NOTIFICATION_LIST_MAX_HEIGHT = 448;

/** Phần màn hình dành cho header, đầu panel và khoảng thở dưới panel (13rem) */
export const NOTIFICATION_LIST_VIEWPORT_OFFSET = 208;

/**
 * Nút chuông cách đường kẻ dưới header 14px, cộng 8px để mép trên panel
 * nằm dưới đường kẻ chứ không chạm vào nó
 */
export const NOTIFICATION_PANEL_SIDE_OFFSET = 22;
