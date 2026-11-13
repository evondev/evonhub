export enum InterviewQuestionType {
  /** Đoán code chạy ra gì, chọn một đáp án */
  Predict = "predict",
  /** Sắp xếp các dòng log theo thứ tự in ra */
  LogOrder = "log-order",
  /** Câu hỏi khái niệm, chọn một đáp án */
  Concept = "concept",
}

export enum InterviewQuestionStatus {
  /** Nháp: AI vừa tạo hoặc Admin chưa đăng, học viên không thấy */
  Draft = "draft",
  Published = "published",
}

export enum InterviewDifficulty {
  Easy = "easy",
  Medium = "medium",
  Hard = "hard",
}

export enum InterviewQuestionOrigin {
  Ai = "ai",
  Manual = "manual",
}
