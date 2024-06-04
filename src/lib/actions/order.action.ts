"use server";
import Course from "@/database/course.model";
import Order from "@/database/order.model";
import User from "@/database/user.model";
import { EOrderStatus, Role } from "@/types/enums";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

interface CreateOrderParams {
  user: string;
  course: string;
  amount: number;
  discount?: number;
  total: number;
  status: EOrderStatus;
}
export async function createOrder(params: CreateOrderParams) {
  try {
    connectToDatabase();
    const newOrder = new Order({
      ...params,
      code: `DH-${new Date().getTime().toString().slice(-8)}`,
    });
    await newOrder.save();
  } catch (error) {}
}
interface UpdateOrderParams {
  user: string;
  course: string;
  status: EOrderStatus;
}
export async function updateOrder(params: UpdateOrderParams) {
  try {
    connectToDatabase();
    await Order.updateOne(
      { user: params.user, course: params.course },
      { status: params.status }
    );
    revalidatePath("/admin/order/manage");
  } catch (error) {
    console.log(error);
  }
}
export async function getAllOrders(params: {
  limit?: number;
  userId?: string;
}) {
  try {
    connectToDatabase();
    const findUser = await User.findById(params.userId);
    const userCourses = await Course.find({ author: findUser?._id });
    let query: any = {};
    if (findUser?.role === Role.EXPERT) {
      query = { course: { $in: userCourses.map((course) => course._id) } };
    }
    const orders = await Order.find(query)
      .limit(params.limit || 500)
      .populate({
        path: "course",
        model: Course,
        select: "title",
      })
      .populate({
        path: "user",
        model: User,
        select: "username email",
      })
      .sort({ createdAt: -1 });
    return orders;
  } catch (error) {
    console.log(error);
  }
}
