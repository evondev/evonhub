"use server";
import UserModel from "@/modules/user/models";
import { UserRole } from "@/shared/constants/user.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { getCurrentUser } from "@/shared/libs/auth";
import HistoryModel from "@/shared/models/history.model";
import { HistoryItemData } from "@/shared/types/history.types";
import { ScoreItemData } from "@/shared/types/score.types";
import { UserItemData } from "@/shared/types/user.types";
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

interface SyncUserLeaderboardProps {
  // Bỏ qua: luôn đồng bộ cho user đang đăng nhập. Giữ lại để caller cũ không lỗi type
  userId?: string;
}

export const syncUserLeaderboard = async (
  _props?: SyncUserLeaderboardProps,
): Promise<boolean | undefined> => {
  try {
    await connectToDatabase();

    const findUser = (await getCurrentUser()) as UserItemData | null;

    if (!findUser) return;

    const userId = findUser._id;

    if (findUser.role === UserRole.Admin) {
      const existScores = (await ScoreModel.find({}).limit(
        100
      )) as ScoreItemData[];
      existScores.forEach(async (score) => {
        const user = await UserModel.findById(score.user.toString());
        if (user) {
          user.score = score.score;
          await user.save();
        }
      });
      return true;
    }
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
      findUser.score = totalScore;
      await findUser.save();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return undefined;
  }
};

export const fetchUserLeaderboardRank = async ({
  userId,
}: {
  userId: string;
}) => {
  try {
    connectToDatabase();
    const leaderBoard = await ScoreModel.find({}).sort({ score: -1 }).limit(4);
    const userRank = leaderBoard.findIndex(
      (user) => user.user.toString() === userId
    );
    return userRank + 1;
  } catch (error) {
    console.error("Error fetching user rank:", error);
    return undefined;
  }
};
