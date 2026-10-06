import { CourseItemData } from "@/modules/course/types";
import { Types } from "mongoose";

/** Tiến độ một khóa: số bài đã học trên tổng số bài */
export interface CourseProgress {
  progress: number;
  current: number;
  total: number;
}

/** Một dòng kết quả $group đếm theo khóa */
export interface CountByCourse {
  _id: Types.ObjectId;
  count: number;
}

export interface FirstLessonLink {
  _id: string;
  slug: string;
}

/** Khóa đang học, cùng chỉ số với bài đầu tiên và tiến độ của từng khóa */
export interface UserCoursesContinueData {
  courses: CourseItemData[];
  lessons: (FirstLessonLink | null)[];
  progresses: CourseProgress[];
}
