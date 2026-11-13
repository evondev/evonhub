/** Việc người dùng làm trên trang, ghi vào nhật ký hoạt động cho admin xem */
export enum ActivityType {
  // Học tập
  ViewLesson = "VIEW_LESSON",
  ViewVideo = "VIEW_VIDEO",
  CompleteLesson = "COMPLETE_LESSON",
  Comment = "COMMENT",
  RateCourse = "RATE_COURSE",
  PracticeInterview = "PRACTICE_INTERVIEW",
  // Mua khoá
  EnrollFree = "ENROLL_FREE",
  CreateOrder = "CREATE_ORDER",
  PurchaseCourse = "PURCHASE_COURSE",
  // Tài khoản
  SignUp = "SIGN_UP",
  // Nội dung (admin, chuyên gia)
  CreateCourse = "CREATE_COURSE",
  UpdateCourse = "UPDATE_COURSE",
  DeleteCourse = "DELETE_COURSE",
  CreateLecture = "CREATE_LECTURE",
  UpdateLecture = "UPDATE_LECTURE",
  DeleteLecture = "DELETE_LECTURE",
  CreateLesson = "CREATE_LESSON",
  UpdateLesson = "UPDATE_LESSON",
  DeleteLesson = "DELETE_LESSON",
  ReorderOutline = "REORDER_OUTLINE",
}
