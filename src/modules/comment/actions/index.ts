"use server";

import CourseModel from "@/modules/course/models";
import { canManageCourse } from "@/modules/course/services/course-permission.service";
import LessonModel from "@/modules/lesson/models";
import { sendNotification } from "@/modules/notifications/services/send-notification.service";
import UserModel from "@/modules/user/models";
import {
  CommentStatus,
  MAX_REPLY_LEVEL,
} from "@/shared/constants/comment.constants";
import {
  MODERATION_DELETE_ERROR_MESSAGE,
  MODERATION_SAVE_ERROR_MESSAGE,
} from "@/shared/constants/moderation.constants";
import { escapeHtml, parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { ModerationResult, ModerationScope } from "@/shared/types";
import {
  getSafeKeyword,
  isExcludedIdList,
} from "@/shared/utils/moderation.utils";
import {
  findManageableCourseIds,
  getCurrentStaff,
  getCurrentUser,
} from "@/shared/libs/auth";
import { escapeRegExp } from "lodash";
import { FilterQuery, isValidObjectId } from "mongoose";
import CommentModel from "../models";
import {
  COMMENT_STATUS_FORBIDDEN_MESSAGE,
  COMMENT_STATUS_NOT_FOUND_MESSAGE,
  MAX_COMMENTS_PER_UPDATE,
} from "../constants/comment-manage.constants";
import { CommentItemData } from "../types";
import {
  FetchCommentsManageParams,
  FetchCommentsManageResult,
  UpdateCommentsStatusParams,
  UpdateMatchingCommentsStatusParams,
} from "../types/comment-manage.types";

const MAX_COMMENTS_PER_PAGE = 50;

function isCommentStatus(status: unknown): status is CommentStatus {
  return Object.values(CommentStatus).includes(status as CommentStatus);
}

/**
 * Người xem thường chỉ thấy bình luận đã duyệt cùng bình luận đang chờ của
 * chính mình; người quản lý khóa thấy hết để còn duyệt.
 */
export async function fetchCommentsByLesson(
  lessonId: string,
): Promise<CommentItemData[] | undefined> {
  try {
    if (typeof lessonId !== "string") return [];

    const currentUser = await getCurrentUser();

    await connectToDatabase();

    const findLesson = await LessonModel.findById(lessonId).select("courseId");

    if (!findLesson) return [];

    const isCourseManager =
      !!currentUser &&
      !!findLesson.courseId &&
      (await canManageCourse({
        role: currentUser.role,
        userId: currentUser._id,
        courseId: findLesson.courseId.toString(),
      }));

    const query: FilterQuery<typeof CommentModel> = { lesson: findLesson._id };

    if (!isCourseManager) {
      const visibleConditions: FilterQuery<typeof CommentModel>[] = [
        { status: CommentStatus.Approved },
      ];

      if (currentUser) {
        visibleConditions.push({
          status: CommentStatus.Pending,
          user: currentUser._id,
        });
      }

      query.$or = visibleConditions;
    }

    const comments = await CommentModel.find<CommentItemData>(query)
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        model: UserModel,
        select: "name username avatar",
      });

    return JSON.parse(JSON.stringify(comments));
  } catch (error) {
    console.log(error);
  }
}

interface CommentScopeStaff {
  _id: unknown;
  role: string;
}

/**
 * Bình luận người quản lý được đụng tới, đã áp từ khoá và khoá học (chưa lọc
 * trạng thái): admin mọi khoá, expert khoá của mình. Dùng chung cho danh sách,
 * số đếm tab và thao tác "tất cả" để hai bên luôn cùng một phạm vi.
 */
async function buildCommentScopeQuery(
  currentStaff: CommentScopeStaff,
  { search, courseId }: ModerationScope,
): Promise<FilterQuery<typeof CommentModel>> {
  const scopeQuery: FilterQuery<typeof CommentModel> = {};
  const keyword = getSafeKeyword(search);

  if (keyword) {
    scopeQuery.content = { $regex: escapeRegExp(keyword), $options: "i" };
  }

  const courseIds = await findManageableCourseIds(currentStaff, courseId);

  if (courseIds) {
    const lessonIds = await LessonModel.find({
      courseId: { $in: courseIds },
    }).distinct("_id");

    scopeQuery.lesson = { $in: lessonIds };
  }

  return scopeQuery;
}

/**
 * Admin thấy mọi bình luận, expert chỉ thấy bình luận trong khóa của mình.
 * Từ khoá và khoá học áp cho cả số đếm từng tab; trạng thái chỉ áp cho danh sách.
 */
export async function fetchCommentsManage({
  status,
  courseId,
  page = 1,
  limit = 10,
  search,
}: FetchCommentsManageParams): Promise<FetchCommentsManageResult | undefined> {
  try {
    const currentStaff = await getCurrentStaff();

    if (!currentStaff) return;

    await connectToDatabase();

    const baseQuery = await buildCommentScopeQuery(currentStaff, {
      search,
      courseId,
    });
    const safeLimit = Math.min(
      Math.max(Math.floor(Number(limit)) || 1, 1),
      MAX_COMMENTS_PER_PAGE,
    );
    const safePage = Math.max(Math.floor(Number(page)) || 1, 1);
    const skip = (safePage - 1) * safeLimit;
    const query: FilterQuery<typeof CommentModel> = { ...baseQuery };

    if (isCommentStatus(status)) query.status = status;

    const [comments, total, pendingCount, approvedCount, rejectedCount] =
      await Promise.all([
        CommentModel.find(query)
          .select("content status createdAt user lesson parentId")
          .skip(skip)
          .limit(safeLimit)
          .sort({ createdAt: -1 })
          .populate({ path: "user", model: UserModel, select: "name avatar" })
          .populate({
            path: "lesson",
            model: LessonModel,
            select: "_id title",
            populate: {
              path: "courseId",
              model: CourseModel,
              select: "title slug",
            },
          })
          .populate({
            path: "parentId",
            model: CommentModel,
            select: "user",
            populate: { path: "user", model: UserModel, select: "name" },
          }),
        CommentModel.countDocuments(query),
        CommentModel.countDocuments({
          ...baseQuery,
          status: CommentStatus.Pending,
        }),
        CommentModel.countDocuments({
          ...baseQuery,
          status: CommentStatus.Approved,
        }),
        CommentModel.countDocuments({
          ...baseQuery,
          status: CommentStatus.Rejected,
        }),
      ]);

    return {
      comments: parseData(comments),
      total,
      tabCounts: {
        [CommentStatus.Pending]: pendingCount,
        [CommentStatus.Approved]: approvedCount,
        [CommentStatus.Rejected]: rejectedCount,
        all: pendingCount + approvedCount + rejectedCount,
      },
    };
  } catch (error) {
    console.log(error);
  }
}

function isCommentIdList(commentIds: unknown): commentIds is string[] {
  return (
    Array.isArray(commentIds) &&
    commentIds.length > 0 &&
    commentIds.length <= MAX_COMMENTS_PER_UPDATE &&
    commentIds.every(
      (commentId) =>
        typeof commentId === "string" && isValidObjectId(commentId),
    )
  );
}

/**
 * Duyệt hoặc từ chối một hay nhiều bình luận. Chỉ người quản lý khóa chứa
 * bình luận được đổi: có một bình luận ngoài quyền thì không đổi gì cả.
 * Duyệt xong thì báo cho người viết, người nhận lấy từ bình luận đã lưu.
 */
export async function updateCommentsStatus({
  commentIds,
  status,
}: UpdateCommentsStatusParams): Promise<ModerationResult> {
  try {
    if (!isCommentIdList(commentIds) || !isCommentStatus(status)) {
      return { isSuccess: false, message: MODERATION_SAVE_ERROR_MESSAGE };
    }

    const currentStaff = await getCurrentStaff();

    if (!currentStaff) {
      return { isSuccess: false, message: COMMENT_STATUS_FORBIDDEN_MESSAGE };
    }

    await connectToDatabase();

    const comments = await CommentModel.find({ _id: { $in: commentIds } })
      .select("user lesson status")
      .populate({
        path: "lesson",
        model: LessonModel,
        select: "title courseId",
      });

    if (comments.length === 0) {
      return { isSuccess: false, message: COMMENT_STATUS_NOT_FOUND_MESSAGE };
    }

    const manageableCourseIds = await findManageableCourseIds(currentStaff);
    const manageableCourseIdSet = new Set(manageableCourseIds?.map(String));
    const canManageAll = comments.every(
      (comment) =>
        !manageableCourseIds ||
        manageableCourseIdSet.has(String(comment.lesson?.courseId)),
    );

    if (!canManageAll) {
      return { isSuccess: false, message: COMMENT_STATUS_FORBIDDEN_MESSAGE };
    }

    await CommentModel.updateMany(
      { _id: { $in: comments.map((comment) => comment._id) } },
      { status },
    );

    if (status === CommentStatus.Approved) {
      await notifyApprovedComments(
        comments.filter((comment) => comment.status !== CommentStatus.Approved),
      );
    }

    return { isSuccess: true, count: comments.length };
  } catch (error) {
    console.log(error);

    return { isSuccess: false, message: MODERATION_SAVE_ERROR_MESSAGE };
  }
}

interface ApprovedCommentToNotify {
  user?: unknown;
  lesson?: { title?: string } | null;
}

/** Báo cho người viết là bình luận đã được duyệt; người nhận lấy từ bình luận đã lưu */
async function notifyApprovedComments(comments: ApprovedCommentToNotify[]) {
  await Promise.all(
    comments
      .filter((comment) => comment.user)
      .map((comment) =>
        sendNotification({
          title: "Hệ thống",
          content: `Bình luận của bạn tại bài học <strong>${escapeHtml(comment.lesson?.title || "")}</strong> đã được duyệt`,
          users: [String(comment.user)],
        }),
      ),
  );
}

/**
 * Duyệt hoặc từ chối mọi bình luận khớp bộ lọc đang xem (từ khoá, khoá học,
 * trạng thái của tab), trừ các bình luận người dùng đã bỏ tick. Phạm vi dựng
 * như danh sách nên expert chỉ đụng được khoá của mình.
 */
export async function updateMatchingCommentsStatus({
  scope,
  currentStatus,
  excludedIds,
  status,
}: UpdateMatchingCommentsStatusParams): Promise<ModerationResult> {
  try {
    const isValidCurrentStatus =
      currentStatus === undefined || isCommentStatus(currentStatus);

    if (
      !isCommentStatus(status) ||
      !isValidCurrentStatus ||
      !isExcludedIdList(excludedIds)
    ) {
      return { isSuccess: false, message: MODERATION_SAVE_ERROR_MESSAGE };
    }

    const currentStaff = await getCurrentStaff();

    if (!currentStaff) {
      return { isSuccess: false, message: COMMENT_STATUS_FORBIDDEN_MESSAGE };
    }

    await connectToDatabase();

    const query = await buildCommentScopeQuery(currentStaff, scope);

    query._id = { $nin: excludedIds };
    // Bình luận đã ở đúng trạng thái đích thì để yên, không báo lại
    query.status = currentStatus
      ? { $eq: currentStatus, $ne: status }
      : { $ne: status };

    if (status === CommentStatus.Approved) {
      const commentsToApprove = await CommentModel.find(query)
        .select("user lesson")
        .populate({ path: "lesson", model: LessonModel, select: "title" });

      await CommentModel.updateMany(
        { _id: { $in: commentsToApprove.map((comment) => comment._id) } },
        { status },
      );
      await notifyApprovedComments(commentsToApprove);

      return { isSuccess: true, count: commentsToApprove.length };
    }

    const updateResult = await CommentModel.updateMany(query, { status });

    return { isSuccess: true, count: updateResult.modifiedCount };
  } catch (error) {
    console.log(error);

    return { isSuccess: false, message: MODERATION_SAVE_ERROR_MESSAGE };
  }
}

/**
 * Xoá vĩnh viễn mọi bình luận đã từ chối khớp bộ lọc đang xem, kèm mọi câu trả
 * lời bên dưới chúng (để lại thì thành trả lời mồ côi). Không khôi phục được.
 */
export async function deleteRejectedComments(
  scope: ModerationScope,
): Promise<ModerationResult> {
  try {
    const currentStaff = await getCurrentStaff();

    if (!currentStaff) {
      return { isSuccess: false, message: COMMENT_STATUS_FORBIDDEN_MESSAGE };
    }

    await connectToDatabase();

    const query = await buildCommentScopeQuery(currentStaff, scope);

    query.status = CommentStatus.Rejected;

    const rejectedIds: unknown[] =
      await CommentModel.find(query).distinct("_id");
    const idsToDelete = [...rejectedIds];
    let parentIds = rejectedIds;

    // Trả lời lồng tối đa MAX_REPLY_LEVEL + 1 tầng: đi xuống từng tầng một
    for (
      let level = 0;
      level <= MAX_REPLY_LEVEL && parentIds.length > 0;
      level++
    ) {
      parentIds = await CommentModel.find({
        parentId: { $in: parentIds },
      }).distinct("_id");
      idsToDelete.push(...parentIds);
    }

    const deleteResult = await CommentModel.deleteMany({
      _id: { $in: idsToDelete },
    });

    return { isSuccess: true, count: deleteResult.deletedCount };
  } catch (error) {
    console.log(error);

    return { isSuccess: false, message: MODERATION_DELETE_ERROR_MESSAGE };
  }
}
