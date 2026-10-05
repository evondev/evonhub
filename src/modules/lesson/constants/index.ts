import { LessonTabItem } from "@/modules/lesson/types";

export const lessonTabs: LessonTabItem[] = [
  { value: "outline", label: "Mục lục", isMobileOnly: true },
  { value: "notes", label: "Ghi chú" },
  { value: "comments", label: "Bình luận" },
];

// Bề rộng các vệt chờ tên chương, lệch nhau cho giống chữ thật
export const skeletonChapterWidths: string[] = ["w-3/5", "w-2/5", "w-4/5"];

// Còn từng này giây là tính bài đã học xong
export const NEAR_END_SECONDS = 10;
