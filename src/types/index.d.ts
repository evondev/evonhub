import { IUser } from "@/database/user.model";

type TMenuLink = {
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
}
export { TMenuLink };
