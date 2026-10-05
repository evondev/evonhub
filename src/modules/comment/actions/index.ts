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
import {
  getCurrentCourseManager,
  getCurrentStaff,
  getCurrentUser,
} from "@/shared/libs/auth";
import { escapeRegExp } from "lodash";
import { FilterQuery } from "mongoose";
import CommentModel from "../models";
import {
  CommentItemData,
  FetchCommentsProps,
  UpdateCommentProps,
} from "../types";

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
 * Admin thấy mọi bình luận, expert chỉ thấy bình luận trong khóa của mình.
 * `userId` từ client chỉ dùng làm query key, không tin để lọc.
 */
export async function fetchCommentsManage({
  status,
  page = 1,
  limit = 10,
  search,
}: FetchCommentsProps): Promise<CommentItemData[] | undefined> {
  try {
    const currentStaff = await getCurrentStaff();

    if (!currentStaff) return;

    await connectToDatabase();

    const query: FilterQuery<typeof CommentModel> = {};
    const safeLimit = Math.min(
      Math.max(Math.floor(Number(limit)) || 1, 1),
      MAX_COMMENTS_PER_PAGE,
    );
    const safePage = Math.max(Math.floor(Number(page)) || 1, 1);
    const skip = (safePage - 1) * safeLimit;

    if (isCommentStatus(status)) {
      query.status = status;
    }

    if (typeof search === "string" && search) {
      query.content = { $regex: escapeRegExp(search), $options: "i" };
    }

    if (currentStaff.role !== UserRole.Admin) {
      const ownCourseIds = await CourseModel.find({
        author: currentStaff._id,
      }).distinct("_id");
      const ownLessonIds = await LessonModel.find({
        courseId: { $in: ownCourseIds },
      }).distinct("_id");

      query.lesson = { $in: ownLessonIds };
    }

    const comments = await CommentModel.find(query)
      .skip(skip)
      .limit(safeLimit)
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        model: UserModel,
        select: "username name avatar email",
      })
      .populate({
        path: "lesson",
        select: "_id title slug",
        populate: {
          path: "courseId",
          model: CourseModel,
          select: "title slug",
        },
      });

    return parseData(comments);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Chỉ người quản lý khóa chứa bình luận được duyệt. Người nhận thông báo lấy
 * từ bình luận đã lưu, không lấy `userId` client gửi lên.
 */
export async function handleUpdateComment({
  commentId,
  status,
}: UpdateCommentProps) {
  try {
    if (typeof commentId !== "string" || !isCommentStatus(status)) return;

    await connectToDatabase();

    const findComment = await CommentModel.findById(commentId).populate({
      path: "lesson",
      model: LessonModel,
      select: "title courseId",
    });
    const courseId = findComment?.lesson?.courseId?.toString();

    if (!courseId) return;

    const courseManager = await getCurrentCourseManager(courseId);

    if (!courseManager) return;

    await CommentModel.findByIdAndUpdate(findComment._id, { status });

    if (findComment.user && status === CommentStatus.Approved) {
      await sendNotification({
        title: "Hệ thống",
        content: `Bình luận của bạn tại bài học <strong>${escapeHtml(findComment.lesson.title || "")}</strong> đã được duyệt`,
        users: [findComment.user.toString()],
      });
    }
  } catch (error) {
    console.log(error);
  }
}
