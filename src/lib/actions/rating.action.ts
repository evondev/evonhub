"use server";
import Rating from "@/database/rating.model";
import CourseModel from "@/modules/course/models";
import RatingModel from "@/modules/rating/models";
import UserModel from "@/modules/user/models";
import { ERatingStatus } from "@/types/enums";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

export default async function createRating(params: {
  courseId: string;
  rate: number;
  path: string;
  content: string;
}) {
  try {
    connectToDatabase();
    const { userId } = auth();
    const findUser = await UserModel.findOne({ clerkId: userId });
    if (!findUser) return;
    const findRating = await RatingModel.findOne({
      user: findUser._id,
      course: params.courseId,
    });
    if (findRating) {
      return { message: "Bạn đã đánh giá khóa học này rồi" };
    }
    const newRating = new RatingModel({
      user: findUser._id,
      course: params.courseId,
      rating: params.rate,
      content: params.content,
    });
    newRating.save();
    const findCourse = await CourseModel.findById(params.courseId);
    findCourse.rating.push(params.rate);
    findCourse.save();
    revalidatePath(params.path);
  } catch (error) {
    console.log(error);
  }
}
export async function getRatingByCourse(courseId: string) {
  try {
    connectToDatabase();
    const ratings = await Rating.find({
      course: courseId,
      status: ERatingStatus.ACTIVE,
    }).populate("user", "name avatar");
    return ratings;
  } catch (error) {
    console.log(error);
  }
}
