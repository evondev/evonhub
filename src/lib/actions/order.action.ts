"use server";
import Course from "@/database/course.model";
import OrderModel from "@/modules/order/models";
import { UserRole } from "@/shared/constants/user.constants";
import { getCurrentCourseManager, getCurrentUser } from "@/shared/libs/auth";
import { connectToDatabase } from "../mongoose";

export async function getOrderDetails(orderId: string) {
  try {
    await connectToDatabase();

    const currentUser = await getCurrentUser();

    if (!currentUser) return;

    const order = await OrderModel.findOne({ code: orderId })
      .select("code amount total status plan user course")
      .populate({
        path: "course",
        model: Course,
        select: "title slug",
      });

    if (!order) return;

    // Chỉ chủ đơn, admin hoặc người quản lý khóa học được xem đơn
    const isOwner = String(order.user) === String(currentUser._id);
    const isAdmin = currentUser.role === UserRole.Admin;
    const courseId = order.course?._id?.toString();
    const isCourseManager =
      !isOwner &&
      !isAdmin &&
      !!courseId &&
      !!(await getCurrentCourseManager(courseId));

    if (!isOwner && !isAdmin && !isCourseManager) return;

    return order;
  } catch (error) {
    console.log(error);
  }
}
