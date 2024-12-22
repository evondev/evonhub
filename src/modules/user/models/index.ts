import {
  UserPermission,
  UserRole,
  UserStatus,
} from "@/shared/constants/user.constants";
import { model, models, Schema } from "mongoose";

const userSchema = new Schema({
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
    enum: Object.values(UserStatus),
    default: UserStatus.Active,
  },
  role: {
    type: String,
    default: UserRole.User,
  },
  permissions: [
    {
      type: String,
      enum: Object.values(UserPermission),
      default: [UserPermission.CREATE_COMMENT, UserPermission.CREATE_REACTION],
    },
  ],
  bank: {
    bankAccount: {
      type: String,
    },
    bankName: {
      type: String,
    },
    bankNumber: {
      type: String,
    },
    bankBranch: {
      type: String,
    },
  },
  _destroy: {
    type: Boolean,
    default: false,
  },
  package: {
    type: String,
    enum: ["none", "basic", "pro", "premium", "master"],
    default: "none",
  },
  packageExpire: {
    type: Date,
  },
});
userSchema.index({ clerkId: 1 }, { unique: true });
const UserModel = models.User || model("User", userSchema);
export default UserModel;
