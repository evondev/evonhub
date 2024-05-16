import Rating from "@/database/rating.model";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

export default async function createRating(params: {
  userId: string;
  courseId: string;
  rate: number;
  path: string;
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
    });
    newRating.save();
    revalidatePath(params.path);
  } catch (error) {
    console.log(error);
  }
}
