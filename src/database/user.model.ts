import { EUserPermission, EUserStatus } from "@/types/enums";
import { Document, Schema, model, models } from "mongoose";

export interface IUser extends Document {
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
}
const UserSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  bio: {
    type: String,
  },
  avatar: {
    type: String,
    required: true,
  },
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  liked: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: [EUserStatus.ACTIVE, EUserStatus.INACTIVE],
    default: EUserStatus.ACTIVE,
  },
  role: {
    type: String,
    default: "USER",
  },
  permissions: [
    {
      type: String,
      enum: Object.values(EUserPermission),
      default: [
        EUserPermission.CREATE_COMMENT,
        EUserPermission.CREATE_REACTION,
      ],
    },
  ],
});
const User = models.User || model("User", UserSchema);
export default User;
