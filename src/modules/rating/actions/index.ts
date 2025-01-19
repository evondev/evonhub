"use server";

import { RatingStatus } from "@/shared/constants/rating.constants";
import { parseData } from "@/shared/helpers";
import { connectToDatabase } from "@/shared/libs";
import RatingModel from "../models";
import { RatingItemData } from "../types";

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
