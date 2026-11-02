export interface RoadmapLessonSummary {
  slug: string;
  number: number;
  title: string;
  doneCount: number;
  totalCount: number;
}

export type RoadmapItemStatus = "dang-lam" | "xong" | "chua-lam" | "chua-viet";

export interface RoadmapItem {
  number: number;
  title: string;
  stage: string;
  problem: string;
  status: RoadmapItemStatus;
  gameLevels?: string[];
  loadTest?: string;
  // Chỉ mốc đã viết mới có các trường dưới.
  slug?: string;
  feature?: string;
  summary?: string;
  doneCount?: number;
  totalCount?: number;
  passedCount?: number;
  checkCount?: number;
  todoCount?: number;
  lessons: RoadmapLessonSummary[];
}

export interface RoadmapStageGroup {
  stage: string;
  items: RoadmapItem[];
}
