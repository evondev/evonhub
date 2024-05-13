"use server";
import Comment from "@/database/comment.model";
import {
  CreateCommentParams,
  GetAllCommentsParams,
  ICommentParams,
  ReplyCommentParams,
  UpdateCommentParams,
} from "@/types";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

export async function createComment(params: CreateCommentParams) {
  try {
    connectToDatabase();
    await Comment.create(params);
    revalidatePath(params.path || "/");
  } catch (error) {
    console.log(error);
  }
}
export async function getAllComments(
  params: GetAllCommentsParams
): Promise<ICommentParams[] | undefined> {
  try {
    connectToDatabase();
    let query: any = {};
    if (params.lesson) {
      query.lesson = params.lesson;
    }
    if (params.status) {
      query.status = params.status;
    }
    const comments = await Comment.find(query)
      .populate("user")
      .populate("lesson");
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
