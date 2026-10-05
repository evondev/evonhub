import { UserRole } from "@/shared/constants/user.constants";

/** Một khóa trên trang cấp khóa thủ công: chỉ các trường trang này đọc */
export interface CourseAccessCourse {
  id: string;
  slug: string;
  title: string;
  image?: string;
  /** Giá đang bán, chỉ để hiện trong hộp cấp; đơn cấp tay server tự đọc giá */
  price: number;
  isFree: boolean;
  /** Khóa đã ngừng bán: người đã có vẫn học được, admin vẫn cấp tay được */
  isRetired: boolean;
}

export type CourseAccessSource = "purchase" | "manual";

/** Một khóa thành viên đang có. Ngày và nguồn cần dữ liệu đơn hàng, chưa có thì bỏ trống */
export interface CourseAccessGrant {
  course: CourseAccessCourse;
  grantedAt?: string;
  source?: CourseAccessSource;
}

export interface CourseAccessUser {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  isLocked: boolean;
}

export type CourseAccessPreviewState =
  | "du-lieu"
  | "hop-cap"
  | "hop-thu-hoi"
  | "rong"
  | "dang-tai"
  | "loi";

export interface CourseAccessPreviewStateLink {
  state: CourseAccessPreviewState;
  label: string;
}

/** Hộp đang mở lúc vào trang, chỉ trang xem trước dùng để chụp từng trạng thái */
export type CourseAccessInitialDialog = "grant" | "revoke";

/** Khóa đọc từ DB (đã qua parseData): chỉ các trường cần đổi sang CourseAccessCourse */
export interface CourseAccessCourseSource {
  _id: string;
  slug: string;
  title: string;
  image?: string;
  price?: number;
  free?: boolean;
  status?: string;
}

/** Thành viên đọc từ DB (đã qua parseData), courses đã populate */
export interface CourseAccessUserSource {
  clerkId: string;
  name?: string;
  username: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status?: string;
  createdAt: string;
  courses?: CourseAccessCourseSource[];
}
