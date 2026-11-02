export interface StepProgress {
  isDone: boolean;
  answerId?: string;
  isCorrect?: boolean;
  selectedLines?: number[];
  code?: string;
  text?: string;
  // Lần chạy test chấp nhận gần nhất: bao nhiêu test xanh trên tổng.
  passedCount?: number;
  checkCount?: number;
  updatedAt: string;
}

export type StepProgressPatch = Partial<Omit<StepProgress, "updatedAt">>;

export interface LessonProgress {
  steps: Record<string, StepProgress>;
}

export interface LabProgress {
  // Key là slug của bài hoặc của mốc: cả hai đều là chuỗi bước.
  lessons: Record<string, LessonProgress>;
}
