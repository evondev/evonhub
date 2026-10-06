"use server";
import Course from "@/database/course.model";
import OrderModel from "@/modules/order/models";
import { UserRole } from "@/shared/constants/user.constants";
import { parseData } from "@/shared/helpers";
import { getCurrentCourseManager, getCurrentUser } from "@/shared/libs/auth";
import { OrderDetailsData } from "@/modules/order/types";
import {
  isManualPaymentOrder,
  toManualPaymentPayee,
} from "@/modules/order/utils";
import UserModel from "@/modules/user/models";
import { connectToDatabase } from "../mongoose";

export async function getOrderDetails(
  orderId: string,
): Promise<OrderDetailsData | undefined> {
  try {
    await connectToDatabase();

    const currentUser = await getCurrentUser();

    if (!currentUser) return;

    const order = await OrderModel.findOne({ code: orderId })
      .select(
        "code amount discount total couponCode status plan user course createdAt paidAmount paidAt paymentMethod",
      )
      .populate({
        path: "course",
        model: Course,
        select: "title slug image author",
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

    // Tài khoản nhận tiền của chuyên gia chỉ tra cho đơn chuyển khoản thủ
    // công: đơn SePay không được kéo ngân hàng của tác giả ra, kể cả admin
    const author = isManualPaymentOrder(order)
      ? await UserModel.findById(order.course?.author).select(
          "name username email socials bank",
        )
      : undefined;
    const orderData = parseData(order);

    return {
      code: orderData.code,
      status: orderData.status,
      createdAt: orderData.createdAt,
      amount: orderData.amount,
      discount: orderData.discount || 0,
      total: orderData.total,
      couponCode: orderData.couponCode,
      paidAmount: orderData.paidAmount || 0,
      paidAt: orderData.paidAt,
      paymentMethod: orderData.paymentMethod,
      payee: author ? toManualPaymentPayee(parseData(author)) : undefined,
      course: orderData.course
        ? {
            title: orderData.course.title,
            slug: orderData.course.slug,
            image: orderData.course.image,
          }
        : undefined,
    };
  } catch (error) {
    console.log(error);
  }
}
