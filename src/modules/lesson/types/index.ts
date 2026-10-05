export type LessonTabValue = "outline" | "notes" | "comments";

export interface LessonTabItem {
  value: LessonTabValue;
  label: string;
  // Mục lục đã có cột riêng từ lg nên tab này chỉ hiện ở màn hẹp
  isMobileOnly?: boolean;
}
