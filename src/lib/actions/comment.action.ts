"use server";
import Comment from "@/database/comment.model";
import LessonModel from "@/modules/lesson/models";
import { CommentStatus } from "@/shared/constants/comment.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { canAccessCourseContent, getCurrentUser } from "@/shared/libs/auth";
import { connectToDatabase } from "../mongoose";

// Khớp với giới hạn của form bình luận
const COMMENT_MIN_LENGTH = 10;
const COMMENT_MAX_LENGTH = 250;

export interface CreateCommentProps {
  content: string;
  lesson: string;
  parentId?: string;
}

/**
 * Người viết, trạng thái duyệt và cấp lồng đều tính ở server, client chỉ gửi
 * nội dung, bài học và bình luận cha.
 */
export async function createComment({
  content,
  lesson,
  parentId,
}: CreateCommentProps) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return false;

    // Chỉ nhận chuỗi, chặn client gửi object toán tử Mongo như { $ne: null }
    if (typeof content !== "string" || typeof lesson !== "string") return false;

    if (parentId && typeof parentId !== "string") return false;

    if (
      content.trim().length === 0 ||
      content.length < COMMENT_MIN_LENGTH ||
      content.length > COMMENT_MAX_LENGTH
    )
      return false;

    await connectToDatabase();

    const findLesson = await LessonModel.findOne({
      _id: lesson,
      _destroy: false,
    }).select("courseId");

    if (!findLesson?.courseId) return false;

    // Bình luận chỉ hiện với người đã mua hoặc quản lý khóa, bài học thử thì không
    const hasAccess = await canAccessCourseContent(
      findLesson.courseId.toString(),
    );

    if (!hasAccess) return false;

    let level = 0;
    let parentCommentId = null;

    if (parentId) {
      const parentComment = await Comment.findOne({
        _id: parentId,
        lesson: findLesson._id,
      }).select("level");

      if (!parentComment) return false;

      level = (parentComment.level || 0) + 1;
      parentCommentId = parentComment._id;
    }

    const staffRoles: string[] = [UserRole.Admin, UserRole.Expert];
    const status = staffRoles.includes(currentUser.role)
      ? CommentStatus.Approved
      : CommentStatus.Pending;

    const newComment = await Comment.create({
      content,
      lesson: findLesson._id,
      user: currentUser._id,
      parentId: parentCommentId,
      level,
      status,
    });

    return !!newComment;
  } catch (error) {
    console.log(error);

    return false;
  }
}
