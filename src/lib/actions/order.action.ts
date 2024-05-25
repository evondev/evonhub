"use server";
import Course from "@/database/course.model";
import Order from "@/database/order.model";
import User from "@/database/user.model";
import { EOrderStatus } from "@/types/enums";
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
  } catch (error) {
    console.log(error);
  }
}
export async function getAllOrders() {
  try {
    connectToDatabase();
    const orders = await Order.find()
      .populate({
        path: "course",
        model: Course,
        select: "title",
      })
      .populate({
        path: "user",
        model: User,
        select: "username",
      });
    return orders;
  } catch (error) {
    console.log(error);
  }
}
