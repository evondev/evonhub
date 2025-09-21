"use server";
import UserModel from "@/modules/user/models";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { ScoreItemData } from "@/shared/types/score.types";
import ScoreModel from "../models";

export const fetchLeaderBoard = async (): Promise<
  ScoreItemData[] | undefined
> => {
  try {
    connectToDatabase();

    const response = await ScoreModel.find({}).limit(5).populate({
      path: "user",
      model: UserModel,
      select: "_id username avatar",
    });
    return parseData(response) as ScoreItemData[];
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return undefined;
  }
};
