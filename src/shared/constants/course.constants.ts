export enum CourseStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
  Archived = "archived",
}

/**
 * Khóa đang bán và khóa đã ngừng bán (`Rejected`) đều học được với người đã sở
 * hữu. Ngừng bán chỉ có nghĩa là không bán nữa, không phải thu hồi quyền học.
 * Khóa lưu trữ (`Archived`) đã xóa nội dung nên ẩn với mọi học viên.
 */
export const LEARNABLE_COURSE_STATUSES = [
  CourseStatus.Approved,
  CourseStatus.Rejected,
];

/**
 * Video lẻ là một Course chỉ có một chương ẩn và một bài, để dùng lại nguyên
 * luồng đơn hàng, coupon, cấp quyền, đánh giá, bình luận của khóa học.
 * Khóa cũ không có field `type` vẫn là khóa học.
 */
export enum CourseType {
  Course = "course",
  Video = "video",
}

/** Gộp vào query của các danh sách chỉ dành cho khóa học (trang chủ, khám phá...) */
export const COURSE_ONLY_QUERY = { type: { $ne: CourseType.Video } };

export enum CourseLabel {
  New = "new",
  Hot = "hot",
  Top = "top",
  None = "none",
}
export enum CourseLevel {
  Easy = "easy",
  Medium = "medium",
  Expert = "expert",
}

export const COURSE_LEVEL_LABELS: Record<CourseLevel, string> = {
  [CourseLevel.Easy]: "Cơ bản",
  [CourseLevel.Medium]: "Trung bình",
  [CourseLevel.Expert]: "Nâng cao",
};
export enum CourseInfo {
  Requirements = "requirements",
  Qa = "qa",
  Gained = "gained",
}
