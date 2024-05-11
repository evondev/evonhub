import { ICourse } from "@/database/course.model";
import { IUser } from "@/database/user.model";

export type TMenuLink = {
  title: string;
  icon: React.ReactNode;
  url: string;
  isAdmin?: boolean;
};
export interface CreateUserParams {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  joinedAt?: Date;
  bio?: string;
  status?: TUserStatus;
}
export interface UpdateUserParams {
  clerkId: string;
  updateData: Omit<Partial<IUser>, "role">;
  path: string;
}
export interface DeleteUserParams {
  clerkId: string;
}
export interface CreateCourseParams {
  title: string;
  slug: string;
  path: string;
  author: string;
}
export interface UpdateCourseParams {
  slug: string;
  updateData: Partial<ICourse>;
  path?: string;
  courseSlug?: string;
}
export interface CourseParams {
  lecture: {
    id: string;
    title: string;
    lessons: {
      _id: string;
      title: string;
      slug: string;
      type: string;
      video: string;
      duration: number;
      content: string;
      status: string;
      order: number;
    }[];
    order: number;
  }[];
}
export interface GetUsersParams {
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  filter?: string;
}
export interface ICommentParams {
  _id: string;
  content: string;
  user: {
    username: string;
    avatar: string;
  };
  course: string;
  lesson: string;
  createdAt: Date;
}

export type TStatus = "pending" | "approved" | "rejected";
export type TLevel = "easy" | "medium" | "expert";
export type TCourseInfo = "requirements" | "qa" | "gained";
export type TUserStatus = "active" | "inactive";
