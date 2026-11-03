import { CategoryManageItem } from "../types";

/** "3 khóa học · 5 video", bỏ phần bằng 0; chưa gắn gì thì "Chưa dùng" */
export function formatCategoryUsage({
  courseCount,
  videoCount,
}: CategoryManageItem): string {
  const usageParts: string[] = [];

  if (courseCount > 0) usageParts.push(`${courseCount} khóa học`);
  if (videoCount > 0) usageParts.push(`${videoCount} video`);

  return usageParts.join(" · ") || "Chưa dùng";
}

export function isCategoryInUse(category: CategoryManageItem): boolean {
  return category.courseCount + category.videoCount > 0;
}
