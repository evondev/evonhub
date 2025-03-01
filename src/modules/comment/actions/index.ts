"use server";

import { sendNotification } from "@/lib/actions/notification.action";
import CourseModel from "@/modules/course/models";
import LessonModel from "@/modules/lesson/models";
import UserModel from "@/modules/user/models";
import { CommentStatus } from "@/shared/constants/comment.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { FilterQuery } from "mongoose";
import CommentModel from "../models";
import {
  CommentItemData,
  FetchCommentsProps,
  UpdateCommentProps,
} from "../types";

export async function fetchLessonBySlug(slug: string, course?: string) {
  try {
    connectToDatabase();
    const query: FilterQuery<typeof LessonModel> = {
      slug,
      _destroy: false,
    };
    const findCourse = await CourseModel.findOne({ slug: course });
    if (findCourse) query.courseId = findCourse._id.toString();
    const lesson = await LessonModel.findOne(query)
      .select("title content video courseId lectureId iframe")
      .populate({
        path: "courseId",
        model: CourseModel,
        select: "id slug",
      });
    return lesson;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchCommentsByLesson(
  lessonId: string
): Promise<CommentItemData[] | undefined> {
  try {
    connectToDatabase();
    const comments = await CommentModel.find<CommentItemData>({
      lesson: lessonId,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        model: UserModel,
        select: "name avatar",
      });

    return JSON.parse(JSON.stringify(comments));
  } catch (error) {
    console.log(error);
  }
}

export async function fetchCommentsManage({
  userId,
  status,
  page = 1,
  limit = 10,
  search,
}: FetchCommentsProps): Promise<CommentItemData[] | undefined> {
  try {
    connectToDatabase();

    const findUser = await UserModel.findOne({ clerkId: userId });
    let query: FilterQuery<typeof CommentModel> = {};
    const skip = (page - 1) * limit;

    if (status) {
      query.status = status;
    }

    if (search) {
      query.content = { $regex: search, $options: "i" };
    }

    if (![UserRole.Admin].includes(findUser?.role)) {
      query.user = findUser?._id;
    }

    const comments = await CommentModel.find(query)
      .skip(skip)
      .limit(limit)
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

export async function handleUpdateComment({
  commentId,
  status,
  userId,
}: UpdateCommentProps) {
  try {
    connectToDatabase();

    await CommentModel.findByIdAndUpdate(commentId, { status });

    const findComment = await CommentModel.findById(commentId).populate({
      path: "lesson",
      model: LessonModel,
      select: "title",
    });

    if (userId && status === CommentStatus.Approved) {
      await sendNotification({
        title: "Hệ thống",
        content: `Bình luận của bạn tại bài học <strong>${findComment.lesson.title}</strong> đã được duyệt`,
        users: [userId],
      });
    }
  } catch (error) {
    console.log(error);
  }
}
