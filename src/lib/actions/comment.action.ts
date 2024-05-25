"use server";
import Comment from "@/database/comment.model";
import User from "@/database/user.model";
import {
  CreateCommentParams,
  GetAllCommentsParams,
  ReplyCommentParams,
  UpdateCommentParams,
} from "@/types";
import { Role } from "@/types/enums";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

export async function createComment(params: CreateCommentParams) {
  try {
    connectToDatabase();
    const { userId } = auth();
    const findUser = await User.findOne({ clerkId: userId });
    if (!findUser) return;
    await Comment.create({
      ...params,
      user: findUser._id,
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
    const comments = await Comment.find(query).populate({
      path: "user",
      model: User,
      select: "username avatar",
    });

    return comments;
  } catch (error) {
    console.log(error);
  }
}
export async function replyComment(params: ReplyCommentParams) {
  try {
    connectToDatabase();
    const findComment = await Comment.findById(params.commentId);
    if (!findComment) return;
    const newComment = new Comment({
      content: params.user.content,
      user: params.user.userId,
      course: params.user.courseId,
      lesson: params.user.lessonId,
    });
    await newComment.save();
    findComment.reply.push(newComment._id);
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
