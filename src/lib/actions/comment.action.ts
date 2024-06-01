"use server";
import Comment from "@/database/comment.model";
import Course from "@/database/course.model";
import Lesson from "@/database/lesson.model";
import User from "@/database/user.model";
import {
  CreateCommentParams,
  GetAllCommentsParams,
  ReplyCommentParams,
  UpdateCommentParams,
} from "@/types";
import { ECommentStatus, Role } from "@/types/enums";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import { sendNotification } from "./notification.action";

export async function createComment(params: CreateCommentParams) {
  try {
    connectToDatabase();
    const { userId } = auth();
    const findUser = await User.findOne({ clerkId: userId });
    if (!findUser) return;
    await Comment.create({
      ...params,
      user: findUser._id,
      status:
        Role.ADMIN === findUser.role
          ? ECommentStatus.APPROVED
          : ECommentStatus.PENDING,
    });
    revalidatePath(params.path || "/");
  } catch (error) {
    console.log(error);
  }
}
export async function getAllComments(params: GetAllCommentsParams) {
  try {
    connectToDatabase();
    const { userId } = auth();
    if (!userId) return undefined;
    const findUser = await User.findOne({ clerkId: userId });
    let query: any = {};
    if (params.lesson) {
      query.lesson = params.lesson;
    }
    if (params.status) {
      query.status = params.status;
    }
    if (![Role.ADMIN].includes(findUser?.role)) {
      query.user = findUser._id;
    }
    const comments = await Comment.find(query)
      .populate({
        path: "user",
        model: User,
        select: "username avatar",
      })
      .populate({
        path: "lesson",
        select: "title slug",
      })
      .populate({
        path: "course",
        select: "title slug",
      });

    return comments;
  } catch (error) {
    console.log(error);
  }
}
export async function replyComment(params: ReplyCommentParams) {
  try {
    connectToDatabase();
    const { userId } = auth();
    const findUser = await User.findOne({ clerkId: userId });
    const findComment = await Comment.findById(params.commentId)
      .populate({
        path: "lesson",
        model: Lesson,
        select: "title slug",
      })
      .populate({
        path: "user",
        model: User,
        select: "username _id",
      })
      .populate({
        path: "course",
        model: Course,
        select: "title slug",
      });
    if (!findComment) return;

    const newComment = new Comment({
      content: params.user.content,
      user: findUser?._id,
      course: params.user.courseId,
      lesson: params.user.lessonId,
      parentId: findComment._id,
      status:
        Role.ADMIN === findUser.role
          ? ECommentStatus.APPROVED
          : ECommentStatus.PENDING,
    });
    await newComment.save();
    await sendNotification({
      title: "Hệ thống",
      content: `<strong class="text-secondary">${findComment.user.username}</strong> vừa trả lời bình luận của bạn tại bài học <a href="/${findComment.course.slug}/lesson?slug=${findComment.lesson.slug}" class="text-primary font-bold">${findComment.lesson.title}</a>`,
      users: [findComment.user._id],
    });
    revalidatePath(params.user.path);
  } catch (error) {
    console.log(error);
  }
}
export async function updateComment(params: UpdateCommentParams) {
  try {
    connectToDatabase();
    await Comment.findByIdAndUpdate(params.commentId, params.updateData);
    revalidatePath(params.path || "/");
    const findComment = await Comment.findById(params.commentId).populate({
      path: "lesson",
      model: Lesson,
      select: "title",
    });
    if (params.userId && params.updateData.status === "approved") {
      await sendNotification({
        title: "Hệ thống",
        content: `Bình luận của bạn tại bài học <strong>${findComment.lesson.title}</strong> đã được duyệt`,
        users: [params.userId],
      });
    }
  } catch (error) {
    console.log(error);
  }
}
export async function deleteComment(commentId: string) {
  try {
    connectToDatabase();
    await Comment.findByIdAndDelete(commentId);
    revalidatePath("/admin/comment/manage");
  } catch (error) {
    console.log(error);
  }
}
