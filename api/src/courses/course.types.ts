export type CourseLevel = "easy" | "medium" | "expert";
export type CourseStatus = "pending" | "approved" | "rejected" | "archived";

// Một bản ghi khoá học như đang nằm trong MongoDB của Evonhub (đã lược bớt field).
export interface CourseRecord {
  slug: string;
  title: string;
  price: number;
  salePrice: number;
  level: CourseLevel;
  status: CourseStatus;
  rating: number[];
  _destroy: boolean;
}

// Thứ API trả ra cho client.
export interface CourseSummary {
  slug: string;
  title: string;
  price: number;
  salePrice: number;
  level: CourseLevel;
  averageRating: number | null;
  ratingCount: number;
}
