import User from "@/database/user.model";
import { CreateUserParams, DeleteUserParams, UpdateUserParams } from "@/types";
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
