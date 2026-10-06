import "server-only";

import { connectToDatabase } from "@/shared/libs/mongoose";
import CourseModel from "../models";

/**
 * Tăng lượt xem khi mở trang chi tiết khóa. Không đặt trong file "use server"
 * để client không gọi thẳng được mà đẩy lượt xem lên.
 */
export async function incrementCourseViews(slug: string) {
  try {
    await connectToDatabase();
    await CourseModel.updateOne({ slug }, { $inc: { views: 1 } });
  } catch (error) {
    console.log(error);
  }
}
