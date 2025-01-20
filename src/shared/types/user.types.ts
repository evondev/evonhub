import {
  UserPackage,
  UserPermission,
  UserRole,
  UserStatus,
} from "@/shared/constants/user.constants";
import { Document, Schema } from "mongoose";
import { CourseItemData } from "./course.types";

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
  package: UserPackage;
  packageEndDate: Date;
  packageStartDate: Date;
  isMembership: boolean;
  _destroy: boolean;
}
export interface UserItemData extends Omit<UserModelProps, "courses" | "role"> {
  courses: CourseItemData[];
  role: UserRole;
}
export interface UserInfoData extends Omit<UserModelProps, "courses" | "role"> {
  courses: string[];
  role: UserRole;
}
