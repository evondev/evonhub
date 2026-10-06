import { CourseStatus } from "@/shared/constants/course.constants";
import type { CourseItemData } from "./index";

/** Tab trên bảng khoá học: ba trạng thái và "Tất cả" */
export type CourseManageTab = "all" | CourseStatus;

/** Bộ lọc của trang Quản lý khoá học, lưu trên URL */
export interface CourseManageFilters {
  search: string;
  tab: CourseManageTab;
  isFree: boolean;
  page: number;
}

/** Phần dữ liệu một khoá học mà bảng cần */
export interface CourseManageRow {
  id: string;
  slug: string;
  title: string;
  image?: string;
  status: CourseStatus;
  price: number;
  isFree: boolean;
  studentCount: number;
  createdAt: Date | string;
}

/** Số khoá học của từng tab, đã áp từ khoá và lọc miễn phí */
export type CourseManageTabCounts = Record<CourseManageTab, number>;

export interface CourseManageResult {
  courses: CourseManageRow[];
  total: number;
  tabCounts: CourseManageTabCounts;
}

/** Kết quả fetchCoursesManage: khoá của trang đang xem, tổng và số đếm từng tab */
export interface FetchCoursesManageResult {
  courses: CourseItemData[];
  total: number;
  tabCounts: CourseManageTabCounts;
}

/** Một dòng kết quả aggregate đếm học viên theo khóa */
export interface StudentCountByCourse {
  _id: unknown;
  count: number;
}

export type CourseManagePreviewState = "du-lieu" | "rong" | "dang-tai" | "loi";

export interface CourseManagePreviewStateLink {
  state: CourseManagePreviewState;
  label: string;
}
