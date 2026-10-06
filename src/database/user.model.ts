import { EUserPermission, EUserStatus } from "@/types/enums";
import { Document, Schema } from "mongoose";

export interface IUser extends Document {
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
  status: EUserStatus;
  role: string;
  createdAt: Date;
  permissions?: EUserPermission[];
  bank: {
    bankAccount: string;
    bankName: string;
    bankNumber: string;
    bankBranch: string;
  };
  _destroy: boolean;
}
// Dùng chung model của module. Hai schema cùng tên "User" thì file nào nạp
// trước thắng (schema cũ thiếu score, socials), và index chỉ khai ở schema của module.
export { default } from "@/modules/user/models";
