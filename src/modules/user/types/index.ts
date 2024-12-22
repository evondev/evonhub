import { CourseItemData } from "@/modules/course/types";
import { UserPermission, UserStatus } from "@/shared/constants/user.constants";
import { Document, Schema } from "mongoose";

export interface UserModelProps extends Document {
  _id: string;
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  avatar: string;
  courses: Schema.Types.ObjectId[];
  liked: Schema.Types.ObjectId[];
  status: UserStatus;
  role: string;
  createdAt: Date;
  permissions?: UserPermission[];
  bank: {
    bankAccount: string;
    bankName: string;
    bankNumber: string;
    bankBranch: string;
  };
  package: "none" | "basic" | "pro" | "premium" | "master";
  packageExpire: Date;
  _destroy: boolean;
}
export interface UserItemData extends Omit<UserModelProps, "courses"> {
  courses: CourseItemData[];
}
