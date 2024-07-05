import { ICourse } from "@/database/course.model";
import { ILesson } from "@/database/lesson.model";
import { IUser } from "@/database/user.model";
import { ECommonStatus, EReactionType, EUserStatus } from "@/types/enums";

export type TMenuLink = {
  title: string;
  icon: React.ReactNode;
  url: string;
  isAdmin?: boolean;
  isAuth?: boolean;
  isHideMobile?: boolean;
  isExpert?: boolean;
};
export interface CreateUserParams {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  joinedAt?: Date;
  bio?: string;
  status?: EUserStatus;
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
export interface CourseParams extends Omit<ICourse, "lecture"> {
  _id: string;
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
  paidUser?: boolean;
}
export interface ICommentParams {
  _id: string;
  content: string;
  parentId?: string;
  user: {
    _id: string;
    username: string;
    avatar: string;
  };
  course: {
    title: string;
    slug: string;
  };
  lesson: {
    title: string;
    slug: string;
  };
  status: ECommonStatus;
  createdAt: Date;
}
export interface CreateCommentParams {
  content: string;
  course: string;
  path?: string;
  lesson: string;
  parentId?: string;
}
export interface GetAllCommentsParams {
  lesson?: string;
  status?: string;
  userId?: string;
}
export interface ReplyCommentParams {
  commentId: string;
  user: {
    lessonId: string;
    userId: string;
    courseId: string;
    content: string;
    path: string;
  };
}
export interface UpdateCommentParams {
  commentId: string;
  userId?: string;
  updateData: Partial<ICommentParams>;
  path?: string;
}
// reaction
export interface CreateReactionParams {
  type: EReactionType;
  lessonId: string;
  userId: string;
  path: string;
}
export interface AlreadyReactionParams {
  lessonId: string;
  userId: string;
}
// lesson
export interface CreateLessonParams {
  title: string;
  slug: string;
  video: string;
  content: string;
  type: string;
  order: number;
  lectureId: string;
  courseId: string;
}
export interface UpdateLessonParams {
  lessonId: string;
  data: Partial<ILesson>;
  path: string;
}
export interface DeleteLessonParams {
  lessonId: string;
  lectureId: string;
  path: string;
}
// lecture
export interface CreateLectureParams {
  title: string;
  courseId: string;
  order: number;
}
export interface UpdateLectureParams {
  lectureId: string;
  path: string;
  data: {
    title: string;
    order?: number;
  };
}
export interface DeleteLectureParams {
  lectureId: string;
  path: string;
  courseId: string;
}
