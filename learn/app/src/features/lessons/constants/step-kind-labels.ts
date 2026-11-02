import type { LessonStepKind } from "../types/lesson";

export const stepKindLabels: Record<LessonStepKind, string> = {
  prose: "Đọc",
  predict: "Dự đoán",
  "step-flow": "Mô hình",
  "spot-bug": "Tìm lỗi",
  "code-task": "Chạy code",
  "explain-back": "Giải thích lại",
  acceptance: "Test chấp nhận",
  "lab-link": "Bài lab",
};
