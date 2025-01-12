"use server";

import { connectToDatabase } from "@/shared/libs";
import OrderModel from "../models";

export async function fetchCountOrdersByCourse(
  courseId: string
): Promise<number | undefined> {
  try {
    connectToDatabase();
    const count = await OrderModel.countDocuments({ course: courseId });
    return count;
  } catch (error) {
    console.log("error:", error);
  }
}
