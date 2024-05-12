"use server";
import Reaction from "@/database/reaction.model";
import { EReactionType } from "@/types/enums";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

export async function createReaction(params: {
  type: EReactionType;
  lessonId: string;
  userId: string;
  path: string;
}) {
  try {
    connectToDatabase();
    const existReaction = await Reaction.findOne({
      lessonId: params.lessonId,
      userId: params.userId,
    });
    if (existReaction) {
      return {
        type: "error",
        message: "Bạn đã đánh giá bài học này rồi",
      };
    }
    const newReaction = new Reaction({
      ...params,
    });
    await newReaction.save();
    revalidatePath(params.path);
  } catch (error) {
    console.log(error);
  }
}
export async function isAlreadyReaction(params: {
  lessonId: string;
  userId: string;
}): Promise<{ data: string } | undefined> {
  try {
    connectToDatabase();
    const existReaction = await Reaction.findOne({
      lessonId: params.lessonId,
      userId: params.userId,
    });
    return { data: existReaction.type };
  } catch (error) {
    console.log(error);
  }
}
export async function getReactionCount(params: { lessonId: string }) {
  try {
    connectToDatabase();
    const reactions = await Reaction.find({
      lessonId: params.lessonId,
    });
    //  get count of each reaction type
    const reactionCount = reactions.reduce((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, {});
    return reactionCount;
  } catch (error) {
    console.log(error);
  }
}
