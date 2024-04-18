import { Document, Schema, model, models } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  bio?: string;
  avatar: string;
  followers: Schema.Types.ObjectId[];
  following: Schema.Types.ObjectId[];
  website?: string;
  socials?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  liked: Schema.Types.ObjectId[];
  saved: Schema.Types.ObjectId[];
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
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  website: {
    type: String,
  },
  socials: {
    facebook: {
      type: String,
    },
    twitter: {
      type: String,
    },
    instagram: {
      type: String,
    },
    youtube: {
      type: String,
    },
  },
  liked: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  saved: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
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
