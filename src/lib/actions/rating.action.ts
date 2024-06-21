"use server";
import Course from "@/database/course.model";
import Rating from "@/database/rating.model";
import { ERatingStatus } from "@/types/enums";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

export default async function createRating(params: {
  userId: string;
  courseId: string;
  rate: number;
  path: string;
  content: string;
}) {
  try {
    connectToDatabase();
    const findRating = await Rating.findOne({
      user: params.userId,
      course: params.courseId,
    });
    if (findRating) {
      return { message: "Bạn đã đánh giá khóa học này rồi" };
    }
    const newRating = new Rating({
      user: params.userId,
      course: params.courseId,
      rating: params.rate,
      content: params.content,
    });
    newRating.save();
    const findCourse = await Course.findById(params.courseId);
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
