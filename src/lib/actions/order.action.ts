"use server";
import Course from "@/database/course.model";
import Order from "@/database/order.model";
import User from "@/database/user.model";
import { EOrderStatus, EUserStatus, Role } from "@/types/enums";
import { FilterQuery } from "mongoose";
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
      code: `DH${new Date().getTime().toString().slice(-8)}`,
    });
    await newOrder.save();
  } catch (error) {}
}
interface UpdateOrderParams {
  code: string;
  user: string;
  course: string;
  status: EOrderStatus;
}
export async function updateOrder(params: UpdateOrderParams) {
  try {
    connectToDatabase();
    const findUser = await User.findById(params.user);
    if (!findUser) return;
    const findOrder = await Order.findOne({
      code: params.code,
    });
    if (findOrder?.status === EOrderStatus.REJECTED) return;
    await Order.updateOne(
      { user: params.user, course: params.course },
      { status: params.status }
    );

    if (params.status === EOrderStatus.APPROVED) {
      // add course to user
      findUser.courses.push(params.course);
    } else {
      // remove course from user
      findUser.courses = findUser.courses.filter(
        (course: any) => course.toString() !== params.course
      );
    }
    await findUser.save();
    revalidatePath("/admin/order/manage");
  } catch (error) {
    console.log(error);
  }
}
export async function getAllOrders(params: {
  limit?: number;
  userId?: string;
  searchQuery?: string;
  page?: number;
}) {
  try {
    connectToDatabase();
    const findUser = await User.findById(params.userId);
    const userCourses = await Course.find({ author: findUser?._id });
    const { page = 1, limit = 10, searchQuery } = params;
    const skipAmount = (page - 1) * limit;
    const query: FilterQuery<typeof Order> = {};
    if (searchQuery) {
      query.$or = [{ code: { $regex: searchQuery, $options: "i" } }];
    }
    if (findUser?.role === Role.EXPERT) {
      query.course = { $in: userCourses.map((course) => course._id) };
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
      .skip(skipAmount)
      .limit(limit)
      .sort({
        createdAt: -1,
      });
    return orders;
  } catch (error) {
    console.log(error);
  }
}
export async function userBuyCourse(params: Partial<CreateOrderParams>) {
  try {
    connectToDatabase();
    const findUser = await User.findById(params.user);
    if (!findUser)
      return {
        error: "User not found",
      };
    if (findUser.status === EUserStatus.INACTIVE)
      return {
        error: "Tài khoản của bạn đã bị khóa",
      };
    const userCourses = await Course.find({ author: findUser._id });
    if (userCourses.find((course) => course._id === params.course))
      return {
        error: "Bạn đã sở hữu khóa học này rồi",
      };
    const newOrder = new Order({
      ...params,
      code: `DH${new Date().getTime().toString().slice(-8)}`,
    });
    await newOrder.save();
    return {
      order: newOrder,
    };
  } catch (error) {
    console.log(error);
  }
}
export async function getOrderDetails(orderId: string) {
  try {
    connectToDatabase();
    const order = await Order.findOne({ code: orderId })
      .select("code amount total status")
      .populate({
        path: "course",
        model: Course,
        select: "title",
        populate: {
          path: "author",
          model: User,
          select: "bank",
        },
      });
    return order;
  } catch (error) {
    console.log(error);
  }
}
