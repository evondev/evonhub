import "server-only";

import CourseModel from "@/modules/course/models";
import { NotificationType } from "@/modules/notifications/constants/notification-type.constants";
import { sendNotifications } from "@/modules/notifications/services/send-notification.service";
import { NotificationDraft } from "@/modules/notifications/types";
import UserModel from "@/modules/user/models";
import CommentModel from "../models";

export interface CommentToNotify {
  _id: unknown;
  user?: unknown;
  parentId?: unknown;
  lesson?: { _id?: unknown; title?: string; courseId?: unknown } | null;
}

/** Slug khóa của từng bình luận, để bấm thông báo mở đúng bài */
async function findCourseSlugById(comments: CommentToNotify[]) {
  const courseIds = comments.map((comment) => String(comment.lesson?.courseId));
  const courses = await CourseModel.find({ _id: { $in: courseIds } }).select(
    "slug",
  );

  return new Map<string, string>(
    courses.map((course) => [String(course._id), course.slug]),
  );
}

function buildLessonData(
  comment: CommentToNotify,
  courseSlugById: Map<string, string>,
) {
  return {
    courseSlug: courseSlugById.get(String(comment.lesson?.courseId)),
    lessonId: comment.lesson?._id ? String(comment.lesson._id) : undefined,
    lessonTitle: comment.lesson?.title,
    commentId: String(comment._id),
  };
}

/**
 * Báo cho người viết bình luận cha là có người trả lời. Bỏ qua khi tự trả lời
 * bình luận của mình, hoặc bình luận cha đã bị xoá.
 */
async function buildReplyDrafts(
  comments: CommentToNotify[],
  courseSlugById: Map<string, string>,
): Promise<NotificationDraft[]> {
  const replies = comments.filter((comment) => comment.parentId);

  if (replies.length === 0) return [];

  const parentComments = await CommentModel.find({
    _id: { $in: replies.map((reply) => String(reply.parentId)) },
  }).select("user");
  const parentAuthorById = new Map<string, string>(
    parentComments
      .filter((parentComment) => parentComment.user)
      .map((parentComment) => [
        String(parentComment._id),
        String(parentComment.user),
      ]),
  );
  const actors = await UserModel.find({
    _id: { $in: replies.map((reply) => String(reply.user)) },
  }).select("name");
  const actorNameById = new Map<string, string>(
    actors.map((actor) => [String(actor._id), actor.name]),
  );

  return replies.flatMap((reply) => {
    const parentCommentId = String(reply.parentId);
    const parentAuthorId = parentAuthorById.get(parentCommentId);

    if (!parentAuthorId || parentAuthorId === String(reply.user)) return [];

    return [
      {
        type: NotificationType.CommentReply,
        data: {
          ...buildLessonData(reply, courseSlugById),
          parentCommentId,
          actorName: actorNameById.get(String(reply.user)),
        },
        users: [parentAuthorId],
      },
    ];
  });
}

/**
 * Bình luận vừa được duyệt: báo người viết là đã duyệt, và nếu là câu trả lời
 * thì báo người viết bình luận cha. Lỗi ở đây không làm hỏng việc duyệt.
 */
export async function notifyApprovedComments(comments: CommentToNotify[]) {
  const commentsToNotify = comments.filter((comment) => comment.user);

  if (commentsToNotify.length === 0) return;

  try {
    const courseSlugById = await findCourseSlugById(commentsToNotify);
    const approvedDrafts: NotificationDraft[] = commentsToNotify.map(
      (comment) => ({
        type: NotificationType.CommentApproved,
        data: buildLessonData(comment, courseSlugById),
        users: [String(comment.user)],
      }),
    );
    const replyDrafts = await buildReplyDrafts(
      commentsToNotify,
      courseSlugById,
    );

    // Mỗi bình luận vẫn một thông báo riêng, nhưng ghi chung một lần insertMany
    await sendNotifications([...approvedDrafts, ...replyDrafts]);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Câu trả lời hiện ra ngay (admin, expert viết nên được duyệt sẵn): chỉ báo
 * người viết bình luận cha. Lỗi ở đây không làm hỏng việc tạo bình luận.
 */
export async function notifyCommentReplies(comments: CommentToNotify[]) {
  try {
    const courseSlugById = await findCourseSlugById(comments);

    await sendNotifications(await buildReplyDrafts(comments, courseSlugById));
  } catch (error) {
    console.log(error);
  }
}
