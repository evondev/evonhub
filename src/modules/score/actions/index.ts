"use server";
import UserModel from "@/modules/user/models";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import HistoryModel from "@/shared/models/history.model";
import { HistoryItemData } from "@/shared/types/history.types";
import { ScoreItemData } from "@/shared/types/score.types";
import ScoreModel from "../models";

export const fetchLeaderBoard = async ({
  limit = 5,
}: {
  limit: number;
}): Promise<ScoreItemData[] | undefined> => {
  try {
    connectToDatabase();

    const response = await ScoreModel.find({})
      .limit(limit)
      .populate({
        path: "user",
        model: UserModel,
        select: "_id username avatar",
      })
      .sort({ score: -1 });
    return parseData(response) as ScoreItemData[];
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return undefined;
  }
};

export const syncUserLeaderboard = async ({
  userId,
}: {
  userId: string;
}): Promise<boolean | undefined> => {
  try {
    connectToDatabase();

    const existScore = await ScoreModel.findOne({ user: userId });
    const histories = (await HistoryModel.find({
      user: userId,
    })) as HistoryItemData[];
    let totalScore = 0;
    histories.forEach(() => {
      totalScore += 10;
    });
    if (existScore) {
      existScore.score = totalScore;
      await existScore.save();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return undefined;
  }
};
