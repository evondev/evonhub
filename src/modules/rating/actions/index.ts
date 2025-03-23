"use server";

import CourseModel from "@/modules/course/models";
import UserModel from "@/modules/user/models";
import { RatingStatus } from "@/shared/constants/rating.constants";
import { UserRole } from "@/shared/constants/user.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import { auth } from "@clerk/nextjs/server";
import { FilterQuery } from "mongoose";
import RatingModel from "../models";
import {
  FetchRatingManageProps,
  HandleRatingStatusProps,
  RatingItemData,
} from "../types";

export async function fetchRatingsByCourse({
  courseId,
}: {
  courseId: string;
}): Promise<RatingItemData[] | undefined> {
  try {
    connectToDatabase();

    const ratings = await RatingModel.find({
      course: courseId,
      status: RatingStatus.Active,
    }).populate("user");
    return parseData(ratings);
  } catch (error) {
    console.log(error);
  }
}

export async function fetchRatings({
  limit,
  page,
  status,
}: FetchRatingManageProps): Promise<RatingItemData[] | undefined> {
  try {
    connectToDatabase();

    const { userId } = auth();
    const findUser = await UserModel.findOne({ clerkId: userId });

    if (!findUser) return;

    if (![UserRole.Admin, UserRole.Expert].includes(findUser?.role)) return;

    const query: FilterQuery<typeof RatingModel> = {};
    const skip = (page - 1) * limit;

    if (status) {
      query.$or = [{ status: { $regex: status, $options: "i" } }];
    }

    if (findUser?.role !== UserRole.Admin) {
      query.author = findUser._id;
    }
    const ratings = await RatingModel.find(query)
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate({
        model: UserModel,
        path: "user",
        select: "name username email avatar",
      })
      .populate({
        model: CourseModel,
        path: "course",
        select: "image title slug",
      });

    return parseData(ratings);
  } catch (error) {
    console.log(error);
  }
}

export async function handleRatingStatus({
  ratingId,
  status,
}: HandleRatingStatusProps) {
  try {
    connectToDatabase();
    const findRating = await RatingModel.findById(ratingId);
    if (!findRating) return;
    await RatingModel.findByIdAndUpdate(ratingId, {
      status:
        status === RatingStatus.Active
          ? RatingStatus.Inactive
          : RatingStatus.Active,
    });
  } catch (error) {}
}
