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
  role: string;
  joinedAt: Date;
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
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: "USER",
  },
});
const User = models.User || model("User", UserSchema);
export default User;
