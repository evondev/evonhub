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
    if (existReaction) return;
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
}): Promise<{ data: boolean } | undefined> {
  try {
    connectToDatabase();
    const existReaction = await Reaction.findOne({
      lessonId: params.lessonId,
      userId: params.userId,
    });
    return { data: !!existReaction };
  } catch (error) {
    console.log(error);
  }
}
