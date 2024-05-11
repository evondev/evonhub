"use server";
import Comment from "@/database/comment.model";
import { ICommentParams } from "@/types";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

interface CreateCommentParams {
  content: string;
  user: string;
  course: string;
  path?: string;
  lesson: string;
}
export async function createComment(params: CreateCommentParams) {
  try {
    connectToDatabase();
    await Comment.create(params);
    revalidatePath(params.path || "/");
  } catch (error) {
    console.log(error);
  }
}
export async function getAllComments(params: {
  lesson?: string;
  status?: string;
}): Promise<ICommentParams[] | undefined> {
  try {
    connectToDatabase();
    let query: any = {
      lesson: params.lesson,
    };
    if (params.status) {
      query.status = params.status;
    }
    const comments = await Comment.find(query)
      .sort({ createdAt: -1 })
      .populate("user");
    return comments;
  } catch (error) {
    console.log(error);
  }
}
export async function replyComment(params: {
  commentId: string;
  user: {
    lessonId: string;
    userId: string;
    courseId: string;
    content: string;
    path: string;
  };
}) {
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
