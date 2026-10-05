"use server";

import CourseModel from "@/modules/course/models";
import { canManageCourse } from "@/modules/course/services/course-permission.service";
import LessonModel from "@/modules/lesson/models";
import { sendNotification } from "@/modules/notifications/services/send-notification.service";
import UserModel from "@/modules/user/models";
import { CommentStatus } from "@/shared/constants/comment.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { escapeHtml, parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { getCurrentStaff, getCurrentUser } from "@/shared/libs/auth";
import { escapeRegExp } from "lodash";
import { FilterQuery, isValidObjectId } from "mongoose";
import CommentModel from "../models";
import {
  COMMENT_STATUS_FORBIDDEN_MESSAGE,
  COMMENT_STATUS_NOT_FOUND_MESSAGE,
  COMMENT_STATUS_SAVE_ERROR_MESSAGE,
  MAX_COMMENTS_PER_UPDATE,
} from "../constants/comment-manage.constants";
import { CommentItemData } from "../types";
import {
  CommentCourseOption,
  FetchCommentsManageParams,
  FetchCommentsManageResult,
  UpdateCommentsStatusParams,
  UpdateCommentsStatusResult,
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

/**
 * Khoá mà người đang đăng nhập được xem bình luận, đã áp bộ lọc khoá học.
 * `undefined` là không giới hạn (admin, không lọc khoá).
 */
async function findManageableCourseIds(
  currentStaff: { _id: unknown; role: string },
  courseId?: string,
): Promise<unknown[] | undefined> {
  const hasCourseFilter = typeof courseId === "string" && courseId !== "";

  if (hasCourseFilter && !isValidObjectId(courseId)) return [];

  if (currentStaff.role === UserRole.Admin) {
    return hasCourseFilter ? [courseId] : undefined;
  }

  const ownCourseIds: unknown[] = await CourseModel.find({
    author: currentStaff._id,
  }).distinct("_id");

  if (!hasCourseFilter) return ownCourseIds;

  return ownCourseIds.filter((ownCourseId) => String(ownCourseId) === courseId);
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

    const baseQuery: FilterQuery<typeof CommentModel> = {};
    const safeLimit = Math.min(
      Math.max(Math.floor(Number(limit)) || 1, 1),
      MAX_COMMENTS_PER_PAGE,
    );
    const safePage = Math.max(Math.floor(Number(page)) || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    if (typeof search === "string" && search) {
      baseQuery.content = { $regex: escapeRegExp(search), $options: "i" };
    }

    const courseIds = await findManageableCourseIds(currentStaff, courseId);

    if (courseIds) {
      const lessonIds = await LessonModel.find({
        courseId: { $in: courseIds },
      }).distinct("_id");

      baseQuery.lesson = { $in: lessonIds };
    }

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

/** Khoá cho bộ lọc "Khoá học": admin mọi khoá, expert khoá của mình */
export async function fetchCommentManageCourses(): Promise<
  CommentCourseOption[] | undefined
> {
  try {
    const currentStaff = await getCurrentStaff();

    if (!currentStaff) return;

    await connectToDatabase();

    const courseQuery: FilterQuery<typeof CourseModel> = { _destroy: false };

    if (currentStaff.role !== UserRole.Admin) {
      courseQuery.author = currentStaff._id;
    }

    const courses = await CourseModel.find(courseQuery)
      .select("title")
      .sort({ title: 1 });

    return courses.map((course) => ({
      id: course._id.toString(),
      title: course.title,
    }));
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
}: UpdateCommentsStatusParams): Promise<UpdateCommentsStatusResult> {
  try {
    if (!isCommentIdList(commentIds) || !isCommentStatus(status)) {
      return { isSuccess: false, message: COMMENT_STATUS_SAVE_ERROR_MESSAGE };
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
      const newlyApprovedComments = comments.filter(
        (comment) => comment.user && comment.status !== CommentStatus.Approved,
      );

      await Promise.all(
        newlyApprovedComments.map((comment) =>
          sendNotification({
            title: "Hệ thống",
            content: `Bình luận của bạn tại bài học <strong>${escapeHtml(comment.lesson?.title || "")}</strong> đã được duyệt`,
            users: [comment.user.toString()],
          }),
        ),
      );
    }

    return { isSuccess: true };
  } catch (error) {
    console.log(error);

    return { isSuccess: false, message: COMMENT_STATUS_SAVE_ERROR_MESSAGE };
  }
}
