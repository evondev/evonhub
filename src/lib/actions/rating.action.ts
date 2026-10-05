"use server";
import RatingModel from "@/modules/rating/models";
import { getCurrentUser } from "@/shared/libs/auth";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

// Chặn nội dung quá dài gửi thẳng vào action, form không giới hạn trên
const RATING_CONTENT_MAX_LENGTH = 2000;

export interface CreateRatingProps {
  courseId: string;
  rate: number;
  content: string;
  /** Bỏ qua: luôn làm mới trang chủ, nơi hiện đánh giá */
  path?: string;
}

interface CreateRatingResult {
  message: string;
}

export default async function createRating({
  courseId,
  rate,
  content,
}: CreateRatingProps): Promise<CreateRatingResult | undefined> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) return;

    const isValidRate = Number.isInteger(rate) && rate >= 1 && rate <= 5;

    if (!isValidRate) {
      return { message: "Vui lòng chọn mức đánh giá từ 1 đến 5 sao" };
    }

    if (
      typeof content !== "string" ||
      !content.trim() ||
      content.length > RATING_CONTENT_MAX_LENGTH
    ) {
      return { message: "Nội dung đánh giá không hợp lệ" };
    }

    const ownedCourseIds: string[] = (currentUser.courses || []).map(
      (ownedCourseId: unknown) => String(ownedCourseId),
    );

    if (!courseId || !ownedCourseIds.includes(String(courseId))) {
      return { message: "Bạn cần mua khóa học trước khi đánh giá" };
    }

    await connectToDatabase();

    const findRating = await RatingModel.findOne({
      user: currentUser._id,
      course: courseId,
    });

    if (findRating) {
      return { message: "Bạn đã đánh giá khóa học này rồi" };
    }

    // Chưa cộng vào `course.rating`: đánh giá mới ở trạng thái chờ duyệt, mảng
    // sao chỉ được tính lại khi admin duyệt (handleRatingStatus).
    await RatingModel.create({
      user: currentUser._id,
      course: courseId,
      rating: rate,
      content,
    });
    revalidatePath("/");
  } catch (error) {
    console.log(error);
  }
}
