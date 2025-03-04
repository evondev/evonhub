"use server";
import Course from "@/database/course.model";
import User, { IUser } from "@/database/user.model";
import CourseModel from "@/modules/course/models";
import { sendNotification } from "@/modules/notifications/actions";
import OrderModel from "@/modules/order/models";
import UserModel from "@/modules/user/models";
import {
  CreateUserParams,
  DeleteUserParams,
  GetUsersParams,
  UpdateUserParams,
} from "@/types";
import { EOrderStatus, EUserStatus, Role } from "@/types/enums";
import { auth } from "@clerk/nextjs/server";
import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import { createOrder } from "./order.action";

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();
    const user = await UserModel.create(userData);
    return user;
  } catch (error) {
    console.log(error);
  }
}
export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();
    const { userId } = auth();
    const findUser = await UserModel.findOne({ clerkId: userId });
    if (findUser && ![Role.ADMIN, Role.EXPERT].includes(findUser?.role))
      return undefined;
    const { clerkId, updateData, path } = params;
    await UserModel.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
export async function updateUserByUsername(params: any) {
  try {
    connectToDatabase();
    const { userId } = auth();
    const findUser = await UserModel.findOne({ clerkId: userId });
    if (findUser && ![Role.ADMIN, Role.EXPERT].includes(findUser?.role))
      return undefined;
    const { username, updateData } = params;
    await UserModel.findOneAndUpdate({ username }, updateData);
    // revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();
    const { userId } = auth();
    const findUser = await UserModel.findOne({ clerkId: userId });
    if (findUser && ![Role.ADMIN].includes(findUser?.role)) return undefined;
    const user = await UserModel.findOne({ clerkId: params.clerkId });
    if (!user) {
      throw new Error("User not found");
    }
    const deletedUser = await UserModel.findByIdAndUpdate(user._id, {
      status: EUserStatus.INACTIVE,
    });
    return deletedUser;
  } catch (error) {
    console.log(error);
  }
}
export async function getUserById({ userId }: { userId: string }) {
  try {
    connectToDatabase();
    if (!userId) return undefined;
    let user = await UserModel.findOne({ clerkId: userId }).populate({
      path: "courses",
      model: Course,
      select: "title slug free",
    });
    return user;
  } catch (error) {
    console.log(error);
  }
}
export async function getUserByUsername(params: {
  username: string;
  email?: string;
}) {
  try {
    connectToDatabase();
    const { username, email } = params;
    let query: any = {};
    if (username) query.username = username;
    if (email) query.email = email;
    const user = await UserModel.findOne(query).populate({
      path: "courses",
      model: Course,
    });
    return user;
  } catch (error) {
    console.log(error);
  }
}
export async function getAllUsers(
  params: GetUsersParams
): Promise<{ users: IUser[]; isNext: boolean; total: number } | undefined> {
  try {
    connectToDatabase();
    const { userId } = auth();
    const findUser = await UserModel.findOne({ clerkId: userId });
    if (findUser && ![Role.ADMIN].includes(findUser?.role)) return undefined;
    const { page = 1, pageSize = 10, searchQuery, paidUser } = params;
    const skipAmount = (page - 1) * pageSize;
    const query: FilterQuery<typeof User> = {};
    let limit = pageSize;
    if (searchQuery) {
      query.$or = [
        { name: { $regex: searchQuery, $options: "i" } },
        { username: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ];
      limit = 5000;
    }
    if (paidUser) {
      query.courses = {
        $in: await Course.find({ _destroy: false, free: false }).distinct(
          "_id"
        ),
      };
    }
    const users = await UserModel.find(query)
      .select("avatar name username status createdAt email")
      .populate({
        path: "courses",
        model: Course,
        select: "title slug free",
        match: { _destroy: false },
      })
      .skip(skipAmount)
      .limit(limit)
      .sort({
        createdAt: -1,
      });
    const totalUsers = await UserModel.countDocuments(query);
    const isNext = totalUsers > skipAmount + users.length;
    return {
      users,
      isNext,
      total: totalUsers,
    };
  } catch (error) {
    console.log(error);
  }
}
interface AddCourseToUserParams {
  userId: string;
  course: {
    id: string;
    price: number;
    discount?: number;
  };
  path: string;
}
export async function addCourseToUser({
  userId,
  path,
  course: { id: courseId, price: coursePrice, discount = 0 },
}: AddCourseToUserParams) {
  try {
    connectToDatabase();
    const user = await UserModel.findOne({ clerkId: userId });
    if (!user) {
      throw new Error("User not found");
    }
    // check if users already have this course
    if (user.courses.includes(courseId)) {
      return {
        type: "error",
        message: "Thành viên này đã có khóa học này rồi",
      };
    }
    user.courses.push(courseId);
    await user.save();
    await createOrder({
      user: user._id,
      course: courseId,
      amount: coursePrice,
      total: coursePrice - discount,
      discount,
      status: EOrderStatus.APPROVED,
    });
    revalidatePath(path);
    const findCourse = await CourseModel.findById(courseId);
    if (!findCourse?.title) return;
    await sendNotification({
      title: "Hệ thống",
      content: `Chúc mừng bạn đã đăng ký khóa học <strong>${findCourse.title}</strong> thành công`,
      users: [user._id],
    });
  } catch (error) {
    console.log(error);
  }
}
export async function removeCourseFromUser({
  userId,
  courseId,
  path,
}: {
  userId: string;
  courseId: string;
  path: string;
}) {
  try {
    connectToDatabase();
    const user = await UserModel.findOne({ clerkId: userId });
    if (!user) {
      throw new Error("User not found");
    }
    user.courses = user.courses.filter((c: any) => c.toString() !== courseId);
    await user.save();
    revalidatePath(path);
    const findOrder = await OrderModel.findOne({
      user: user._id,
      course: courseId,
    });
    if (findOrder) {
      await OrderModel.findByIdAndUpdate(findOrder._id, {
        status: EOrderStatus.REJECTED,
      });
    }
  } catch (error) {
    console.log(error);
  }
}
export async function getUserInfo({
  userId,
}: {
  userId: string;
}): Promise<IUser | null | undefined> {
  try {
    connectToDatabase();
    const findUser = await UserModel.findOne({ clerkId: userId });

    if (!findUser?._id) return null;

    return JSON.parse(JSON.stringify(findUser));
  } catch (error) {
    console.log(error);
  }
}
