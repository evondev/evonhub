"use server";
import User, { IUser } from "@/database/user.model";
import {
  CreateUserParams,
  DeleteUserParams,
  GetUsersParams,
  UpdateUserParams,
} from "@/types";
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
export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();
    const user = await User.findOneAndDelete({ clerkId: params.clerkId });
    if (!user) {
      throw new Error("User not found");
    }
    // const userCourse = await Course.find({ author: user._id }).distinct("_id");
    // Delete all courses by user
    // await Course.deleteMany({ author: user._id });
    const deletedUser = await User.findByIdAndDelete(user._id);
    return deletedUser;
  } catch (error) {
    console.log(error);
  }
}
export async function getUserById({ userId }: { userId: string }) {
  try {
    connectToDatabase();
    let user = await User.findOne({ clerkId: userId }).populate({
      path: "courses",
      populate: {
        path: "lecture",
      },
    });
    if (!user) {
      user = await User.findById(userId);
    }
    return user;
  } catch (error) {
    console.log(error);
  }
}
export async function getUserByUsername({ username }: { username: string }) {
  try {
    connectToDatabase();
    const user = await User.findOne({ username });
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
    const users = await User.find(query).skip(skipAmount).limit(limit);
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
}: {
  userId: string;
  courseId: string;
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
  } catch (error) {
    console.log(error);
  }
}
export async function removeCourseFromUser({
  userId,
  courseId,
}: {
  userId: string;
  courseId: string;
}) {
  try {
    connectToDatabase();
    const user = await User.findOne({ clerkId: userId });
    if (!user) {
      throw new Error("User not found");
    }
    user.courses = user.courses.filter((c: any) => c.toString() !== courseId);
    await user.save();
    return user;
  } catch (error) {
    console.log(error);
  }
}
