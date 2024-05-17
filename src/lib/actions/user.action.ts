"use server";
import Course from "@/database/course.model";
import User, { IUser } from "@/database/user.model";
import {
  CreateUserParams,
  DeleteUserParams,
  GetUsersParams,
  UpdateUserParams,
} from "@/types";
import { EUserStatus } from "@/types/enums";
import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();
    const user = await User.create(userData);
    return user;
  } catch (error) {
    console.log(error);
  }
}
export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();
    const { clerkId, updateData, path } = params;
    await User.findOneAndUpdate({ clerkId }, updateData, {
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
    const { username, updateData } = params;
    await User.findOneAndUpdate({ username }, updateData, {
      new: true,
    });
    // revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();
    const user = await User.findOne({ clerkId: params.clerkId });
    if (!user) {
      throw new Error("User not found");
    }
    const deletedUser = await User.findByIdAndUpdate(user._id, {
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
    let user = await User.findOne({ clerkId: userId }).populate({
      model: Course,
      path: "courses",
    });
    if (!user) {
      user = await User.findById(userId).populate({
        model: Course,
        path: "courses",
      });
    }
    return user;
  } catch (error) {
    console.log(error);
  }
}
export async function getUserByUsername({ username }: { username: string }) {
  try {
    connectToDatabase();
    const user = await User.findOne({ username }).populate({
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
    const { page = 1, pageSize = 10, searchQuery } = params;
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
    const users = await User.find(query).skip(skipAmount).limit(limit).sort({
      joinedAt: -1,
    });
    const totalUsers = await User.countDocuments(query);
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
export async function addCourseToUser({
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
    const user = await User.findOne({ clerkId: userId });
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
    revalidatePath(path);
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
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      throw new Error("User not found");
    }
    user.courses = user.courses.filter((c: any) => c.toString() !== courseId);
    await user.save();
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
