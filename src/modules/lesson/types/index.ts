export type LessonTabValue = "outline" | "notes" | "comments";

/** Tên và số phút của một bài, cho chỗ chỉ cần nhắc tới bài (nút học tiếp) */
export interface LessonSummary {
  _id: string;
  title: string;
  /** Số phút */
  duration: number;
}

export interface LessonTabItem {
  value: LessonTabValue;
  label: string;
  // Mục lục đã có cột riêng từ lg nên tab này chỉ hiện ở màn hẹp
  isMobileOnly?: boolean;
}
